import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { array, date, z } from "zod";

export const CreateScreening = async (req, res) => {
  const ScreeningSchema = z.object({
    movieId: z.string().min(1, "MovieId is required"),
    screenId: z.string().min(1, "ScreenId is required"),
    startTime: z
      .string()
      .refine((dateString) => !isNaN(Date.parse(dateString)), {
        message: "Invalid date format",
      })
      .transform((dateString) => new Date(dateString)),
    endTime: z
      .string()
      .refine((dateString) => !isNaN(Date.parse(dateString)), {
        message: "Invalid date format",
      })
      .transform((dateString) => new Date(dateString)),
  });

  try {
    const validateData = ScreeningSchema.parse(req.body);
    const screenExists = await prisma.screen.findUnique({
      where: { id: validateData.screenId },
    });
    if (!screenExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screen not found" });
    }
    const movieExists = await prisma.movie.findUnique({
      where: { id: validateData.movieId },
    });
    if (!movieExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Movie doesn't exist" });
    }
    const newScreening = await prisma.screening.create({
      data: {
        movieId: validateData.movieId,
        screenId: validateData.screenId,
        startTime: validateData.startTime,
        endTime: validateData.endTime,
      },
      include: {
        price: true,
      },
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: "Screening added", data: newScreening });
  } catch (err) {
    console.error(err);
    if (err.name === "ZodError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
};

export const updateScreening = async (req, res) => {
  const UpdateScreeningSchema = z.object({
    screeningId: z.string().min(1, "ScreeningId is required"),
    movieId: z.string().min(1, "MovieId is required"),
    screenId: z.string().min(1, "ScreenId is required"),
    startTime: z.date().refine((date) => date > new Date(), {
      message: "Starting Time must be in the future",
    }),
    endTime: z.date().refine((data, ctx) => data > ctx.parent.startTime, {
      message: "End Time must be after Start Time",
    }),
  });

  try {
    const validatedData = UpdateScreeningSchema.parse(req.body);
    const screeningExists = await prisma.screening.findUnique({
      where: { id: validatedData.screeningId },
    });

    if (!screeningExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screening not found" });
    }
    const movieExists = await prisma.movie.findUnique({
      where: { id: validatedData.movieId },
    });
    if (!movieExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Movie not found" });
    }

    const screenExists = await prisma.screen.findUnique({
      where: { id: validatedData.screenId },
    });
    if (!screenExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screen not found" });
    }
    const updatedScreening = await prisma.screening.update({
      where: { id: validatedData.screeningId },
      data: {
        movieId: validatedData.movieId,
        screenId: validatedData.screenId,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
      },
    });

    res
      .status(StatusCodes.OK)
      .json({
        message: "Screening updated successfully",
        data: updatedScreening,
      });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const deleteScreening = async (req, res) => {
  const ScreeningSchema = z.object({
    screeningId: z.string().min(1, "ScreeningId is required"),
  });

  try {
    const validatedData = ScreeningSchema.parse(req.parms);
    const screeningExists = await prisma.screening.findUnique({
      where: { id: validatedData.screeningId },
    });

    if (!screeningExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screening not found" });
    }

    await prisma.screening.delete({
      where: { id: validatedData.screeningId },
    });

    res
      .status(StatusCodes.OK)
      .json({ message: "Screening deleted successfully" });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message });
  }
};
