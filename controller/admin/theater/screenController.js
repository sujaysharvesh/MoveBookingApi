import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { array, z } from "zod";

export const CreateScreen = async (req, res) => {
  const createSeatSchema = z.object({
    id: z.string().min(1, "Theater id is required"),
    name: z.string().min(1, "Screen name is required"),
    capacity: z.number().min(1).max(500, "Capacity must be between 1 and 500"),
    screenType: z.enum(["STANDARD", "IMAX", "PREMIUM", "VIP"]).optional(),
  });

  try {
    const validData = createSeatSchema.parse(req.body);

    const theaterExists = await prisma.theater.findUnique({
      where: { id: validData.id },
      include: {
        screens: true,
      },
    });

    if (!theaterExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Theater does not exist",
      });
    }

    const newScreen = await prisma.screen.create({
      data: {
        name: validData.name,
        theaterId: validData.id,
        capacity: validData.capacity,
        screenType: validData.screenType,
      },
    });

    await prisma.theater.update({
      where: { id: theaterExists.id },
      data: {
        totalScreens: { increment: 1 },
      },
    });

    return res.status(StatusCodes.CREATED).json({
      message: "Screen added to theater successfully",
      screen: theaterExists,
    });
  } catch (error) {
    if (err.name === "ZodError") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Validation failed",
        errors: err.errors,
      });
    }
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: error.message || error,
    });
  }
};

export const GetScreen = async (req, res) => {
const ScreenSchema = z.object({
        screenId: z.string().min(1, "Screen ID is required"),
      });
  try {
    const validData = ScreenSchema.parse(req.body);
    const screenExits = await prisma.screen.findUnique({
      where: { id },
      include: { screenings: true, seatLayout: true },
    });
    if (!screenExits) {
      res.status(StatusCodes.NOT_FOUND).json({ Message: "Screen not Found" });
    }
    res.status(StatusCodes.OK).json({ screenExits });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong" });
  }
};

export const UpdateScreen = async (req, res) => {
    const updateScreenSchema = z.object({
      screenId: z.string().min(1, "Screen ID is required"),
      name: z.string().min(1, "Screen name is required").optional(),
      capacity: z.number().min(1, "Capacity must be a positive number").optional(),
      screenType: z.enum(["STANDARD", "IMAX", "PREMIUM", "VIP"]).optional(),
    });
  
    try {
      const validateData = updateScreenSchema.parse(req.body);
      const screen = await prisma.screen.findUnique({
        where: { id: validateData.screenId },
      });
  
      if (!screen) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Screen not found.",
        });
      }
  
      const updatedScreen = await prisma.screen.update({
        where: { id: validateData.screenId },
        data: {
          ...validateData,
        },
      });
  
      return res.status(StatusCodes.OK).json({
        message: "Screen updated successfully",
        data: updatedScreen,
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
        error: err.message || err,
      });
    }
  };
  
  export const DeleteScreen = async (req, res) => {
    const deleteScreenSchema = z.object({
      screenId: z.string().min(1, "Screen ID is required"),
    });
  
    try {
      const validateData = deleteScreenSchema.parse(req.body);

      const screen = await prisma.screen.findUnique({
        where: { id: validateData.screenId },
      });
  
      if (!screen) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "Screen not found.",
        });
      }
  
      const theaterId = screen.theaterId;
      await prisma.screen.delete({
        where: { id: validateData.screenId },
      });
  
      await prisma.theater.update({
        where: { id: theaterId },
        data: {
          totalScreens: { decrement: 1 },
        },
      });
  
      return res.status(StatusCodes.OK).json({
        message: "Screen deleted successfully",
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
        error: err.message || err,
      });
    }
  };
  