import prisma from "../../../utils/prisma.js";
import { z } from "zod";
import StatusCodes from "http-status-codes";
import { SeatCategory } from "@prisma/client";

export const CreateSeatLayout = async (req, res) => {
  const createSeatSchema = z.object({
    screenId: z.string().min(1, "Screen Id is required"),
    rows: z.object({
      sliver: z
        .array(z.string())
        .min(1, "At least one row is required for silver seats"),
      gold: z
        .array(z.string())
        .min(1, "At least one row is required for gold seats"),
      platinum: z
        .array(z.string())
        .min(1, "At least one row is required for platinum seats"),
    }),
    sliverSeats: z.number().min(1, "At least one silver seat is required"),
    goldSeats: z.number().min(1, "At least one gold seat is required"),
    platinumSeats: z.number().min(1, "At least one platinum seat is required"),
  });

  try {
    const validateData = createSeatSchema.parse(req.body);
    const screenExists = await prisma.screen.findUnique({
      where: { id: validateData.screenId },
    });
    if (!screenExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screen doesn't exist" });
    }

    const seatsData = [];
    validateData.rows.sliver.forEach((row) => {
      for (let i = 1; i <= validateData.sliverSeats; i++) {
        seatsData.push({
          row,
          number: i,
          category: SeatCategory.SLIVER,
          screenId: validateData.screenId,
        });
      }
    });

    validateData.rows.gold.forEach((row) => {
      for (let i = 1; i <= validateData.goldSeats; i++) {
        seatsData.push({
          row,
          number: i,
          category: SeatCategory.GOLD,
          screenId: validateData.screenId,
        });
      }
    });

    validateData.rows.platinum.forEach((row) => {
      for (let i = 1; i <= validateData.platinumSeats; i++) {
        seatsData.push({
          row,
          number: i,
          category: SeatCategory.PLATINUM,
          screenId: validateData.screenId,
        });
      }
    });

    const createdSeats = await prisma.seat.createMany({
      data: seatsData,
    });

    return res.status(StatusCodes.CREATED).json({
      message: `${createdSeats.count} seats created successfully`,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};
