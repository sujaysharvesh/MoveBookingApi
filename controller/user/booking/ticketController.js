import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { z } from "zod";

export const CreateTicket = async (req, res) => {
  const getTicketSchema = z.object({
    bookingId: z.string().min(1, "Booking ID is required"),
  });

  try {
    const validateData = getTicketSchema.parse(req.body);

    const bookingConfirm = await prisma.booking.findUnique({
      where: { id: validateData.bookingId },
      include: { seats: true, screening: true },
    });

    if (!bookingConfirm || bookingConfirm.status !== "CONFIRMED") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Booking is not confirmed yet." });
    }

    const ticketNumber = `TICKET-${new Date().getTime()}-${bookingConfirm.id}`;
    const seatConnections = bookingConfirm.seats.map((seat) => ({
      id: seat.id,  
    }));
    
    const newTicket = await prisma.ticket.create({
      data: {
        user: { connect: { id: bookingConfirm.userId }},
        booking: { connect: { id: bookingConfirm.id } },
        screening: { connect: { id: bookingConfirm.screeningId } },
        seats: {
          connect: seatConnections,  
        },
        totalAmount: bookingConfirm.totalAmount,
        ticketNumber,
      },
      include: {
        seats: true
      }
    });
    return res.status(StatusCodes.CREATED).json({
      message: "Ticket created successfully.",
      ticket: newTicket,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation Error", error: err.errors });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message || err });
  }
};

