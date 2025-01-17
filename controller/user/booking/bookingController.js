
import prisma from "../../../utils/prisma.js";
import StatusCodes from "http-status-codes";
import { promise, z } from "zod";

export const CreateBooking = async (req, res) => {
  const bookingSchema = z.object({
    screeningId: z.string().min(1, "ScreenId is required"),
    seats: z.array(z.string()).min(1, "At least one seat is required"),
  });

  try {
    const validateData = bookingSchema.parse(req.body);

    const screeningExists = await prisma.screening.findUnique({
      where: { id: validateData.screeningId },
      include: { screen: true },
    });

    if (!screeningExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screening not found." });
    }

    const splitSeats = validateData.seats.map((seat) => {
      const row = seat.slice(0, 1);
      const number = parseInt(seat.slice(1), 10);
      return { row, number };
    });

    const seatDetails = await Promise.all(
      splitSeats.map(({ row, number }) =>
        prisma.seat.findUnique({
          where: {
            screenId_row_number: {
              screenId: screeningExists.screenId,
              row,
              number,
            },
          },
          select: { category: true, status: true },
        })
      )
    );

    if (
      seatDetails.some(
        (seat) =>
          !seat || ["BOOKED", "RESERVED", "UNAVAILABLE"].includes(seat.status)
      )
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "One or more selected seats are unavailable." });
    }
    const calculateTotal = async (splitSeats, screeningId) => {
      const seatPrice = await prisma.seatPrice.findMany({
        where: {
          screeningId: validateData.screeningId,
          category: {
            in: splitSeats.map((seat) => seat.category),
          },
        },
        select: {
          category: true,
          price: true,
        },
      });
      const priceMap = seatPrice.reduce((acc, price) => {
        acc[price.category] = price.price;
        return acc;
      }, {});
      let total = 0;
      for (const seat of splitSeats) {
        if (!priceMap[seat.category]) {
          throw new Error(
            `Price not found for seat category: ${seat.category}`
          );
        }
        total += priceMap[seat.category];
      }
      return total;
    };

    const totalAmount = await calculateTotal(seatDetails, screeningExists.id);
    console.log(req.user.userId);
    const booking = await prisma.booking.create({
      data: {
        user: {
          connect: { id: req.user.userId },
        },
        screening: {
          connect: { id: validateData.screeningId },
        },
        seats: {
          connect: splitSeats.map(({ row, number }) => ({
            screenId_row_number: {
              screenId: screeningExists.screenId,
              row,
              number,
            },
          })),
        },
        totalAmount,
      },
    });
    const updateSeats = await Promise.all(
      splitSeats.map(({ row, number }) =>
        prisma.seat.update({
          where: {
            screenId_row_number: {
              screenId: screeningExists.screenId,
              row,
              number,
            },
          },
          data: { status: "RESERVED"},
        })
      )
    );

    res.status(StatusCodes.CREATED).json({ booking });
  } catch (err) {
    if (err.name === "ZodError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation Error", error: err });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong", error: err.message || err });
  }
};

export const GetBookingDetails = async (req, res) => {
  const BookingIdSchema = z.object({
    bookingId: z.string().min(1, "Booking is required"),
  });
  try {
    const validateData = BookingIdSchema.parse(req.body);
    const booking = await prisma.booking.findUnique({
      where: {
        id: validateData.bookingId,
      },
      include: {
        seats: true,
        user: true,
        screening: true,
      },
    });
    if (!booking) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Booking Not Found" });
    }
    res.status(StatusCodes.OK).json({ booking });
  } catch (err) {
    if (err.name === "ZodError") {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation Error", error: err.message });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong", error: err.message || err });
  }
};

export const UpdatePayMentStatus = async (req, res) => {
  const PaymentStatusSchema = z.object({
    bookingId: z.string().min(1, "BookingId is required"),
    paymentStatus: z
      .array(z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]))
      .max(1, "One paymentStatus Allowed"),
  });
  const validateData = PaymentStatusSchema.parse(req.body);
  const bookingExists = await prisma.booking.findUnique({
    where: { id: validateData.bookingId },
  });
  if (!bookingExists) {
    res.status(StatusCodes.NOT_FOUND).json({ message: "Booking not Found" });
  }
  const updateBooking = await prisma.booking.update({
    where: { id: validateData.bookingId },
    data: { paymentStatus: validateData.paymentStatus[0] },
  });
  if (validateData.paymentStatus[0] === "PAID") {
    await prisma.booking.update({
      where: { id: validateData.bookingId },
      data: { status: validateData.paymentStatus },
    });
  }
  try {
  } catch (err) {
    if (err.name === "ZodError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation Error", error: err.message });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong", error: err.message || err });
  }
};
