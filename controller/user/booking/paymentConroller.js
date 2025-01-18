import prisma from "../../../utils/prisma.js";
import StatusCodes from "http-status-codes";
import { array, promise, z } from "zod";
import Stripe from "stripe";

const stripe = new Stripe(process.env.strip_test_api_key);

export const MakePayment = async (req, res) => {
    const paymentSchema = z.object({
      bookingId: z.string().min(1, "BookingId is required"),
      amount: z.number().min(1, "Amount is required"),
      currency: z.string().min(1, "Currency is required"),
      paymentMethod: z.string().min(1, "Payment is required"),
    });
  
    try {
      const validateData = paymentSchema.parse(req.body);
  
      const bookingExists = await prisma.booking.findUnique({
        where: { id: validateData.bookingId },
        include: { seats: true }, // Include the seats in the booking record
      });
      if (!bookingExists) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "Booking not found" });
      }
  
      if (validateData.amount !== bookingExists.totalAmount) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: `Amount should be ${bookingExists.totalAmount}` });
      }
  
      const paymentAmount = validateData.amount * 100; // Convert to cents for Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: paymentAmount,
        currency: validateData.currency,
        payment_method_types: ["card"],
      });
  
      if (!paymentIntent) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Something went wrong while creating the payment intent" });
      }
  
      const paymentStatus = await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: validateData.paymentMethod,
      });
  
      // Check if the payment succeeded
      if (paymentStatus.status !== "succeeded") {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Payment failed" });
      }
  
      // Update the booking status to CONFIRMED and PAID
      await prisma.booking.update({
        where: { id: validateData.bookingId },
        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
        },
      });
  
      if (bookingExists.seats && Array.isArray(bookingExists.seats)) {
        await Promise.all(
          bookingExists.seats.map(async (seat) => {
            await prisma.seat.update({
              where: { id: seat.id },
              data: { status: "BOOKED" },
            });
          })
        );
      } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Seats not found for this booking" });
      }
  
      await prisma.payment.create({
        data: {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          currency: paymentIntent.currency,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
        },
      });
  
      res.status(StatusCodes.OK).json({ message: "Payment successfully processed" });
  
    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Validation Error", error: err.errors });
      }
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error: err.message || err });
    }
  };
  

export const GetPaymentStatus = async (req, res) => {
    const paymentIdSchema = z.object({
        paymentId: z.string().min(1, "PaymentId is required")
    })
  try {
    const validateData = paymentIdSchema.parse(req.body);
    const paymentStatus = await prisma.payment.findUnique({ where: { id: validateData.paymentId }})
    if(!paymentStatus){
        res.status(StatusCodes.NOT_FOUND).json("payment details not Found")
    }
    res.status(StatusCodes.OK).json({ paymentStatus });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went Wrong", error: err.message || err });
  }
};
