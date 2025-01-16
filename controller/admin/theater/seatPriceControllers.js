import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { array, date, z } from "zod";

import { SeatCategory } from '@prisma/client';  



export const setSeatPrice = async (req, res) => {
  const SeatPriceSchema = z.object({
    screeningId: z.string().min(1, "ScreeningId is required"),
    prices: z
      .object({
        sliver: z.number().min(0, "Price must be a positive number"),
        gold: z.number().min(0, "Price must be a positive number"),
        platinum: z.number().min(0, "Price must be a positive number"),
      })
      .refine((data) => data.sliver > 0 || data.gold > 0 || data.platinum > 0, {
        message: "At least one seat category must have a positive price.",
      }),
  });

  try {
    const validateData = SeatPriceSchema.parse(req.body);

    const screeningExists = await prisma.screening.findUnique({
      where: { id: validateData.screeningId },
    });

    if (!screeningExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Screening not found" });
    }

    const priceData = [];
    Object.entries(validateData.prices).forEach(([category, price]) => {
        if (price > 0) {
          priceData.push({
            screeningId: validateData.screeningId,
            category: SeatCategory[category.toUpperCase()],
            price: price,
          });
        }
      });

    const createdSeats = await prisma.seatPrice.createMany({
      data: priceData,
    });

    const updatedScreening = await prisma.screening.findUnique({
      where: { id: validateData.screeningId },
      include: { price: true },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Set prices for seats successfully",
      data: updatedScreening,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation Error", error: err.errors });
    }

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const updateSeatPrice = async (req, res) => {
    const SeatPriceSchema = z.object({
      screeningId: z.string().min(1, "ScreeningId is required"),
      prices: z
        .object({
          silver: z.number().min(0, "Price must be a positive number").optional(),
          gold: z.number().min(0, "Price must be a positive number").optional(),
          platinum: z.number().min(0, "Price must be a positive number").optional(),
        })
        .refine((data) => data.sliver > 0 || data.gold > 0 || data.platinum > 0, {
          message: "At least one seat category must have a positive price.",
        }),
    });
  
    try {
      const validateData = SeatPriceSchema.parse(req.body);
      const screeningExists = await prisma.screening.findUnique({
        where: { id: validateData.screeningId },
      });
  
      if (!screeningExists) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "Screening not found" });
      }

      const priceData = [];
      Object.entries(validateData.prices).forEach(([category, price]) => {
        if (price > 0) {
          priceData.push({
            category: SeatCategory[category.toUpperCase()], 
            price: price,
          });
        }
      });
  
      console.log("Price data to upsert:", priceData);
  
      const updatedPrices = await Promise.all(
        priceData.map((priceDataItem) => {
          return prisma.seatPrice.upsert({
            where: {
              screeningId_category: {
                screeningId: validateData.screeningId,
                category: priceDataItem.category,
              },
            },
            update: {
              price: priceDataItem.price,
            },
            create: {
              screeningId: validateData.screeningId,
              category: priceDataItem.category,
              price: priceDataItem.price,
            },
          });
        })
      );
      const updatedScreening = await prisma.screening.findUnique({
        where: { id: validateData.screeningId },
        include: { price: true },
      });
  
      res.status(StatusCodes.OK).json({
        message: "Updated seat prices successfully",
        data: updatedScreening,
      });
    } catch (err) {
      if (err.name === "ZodError") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Validation Error", error: err.errors });
      }
  
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong", error: err.message });
    }
  };
  


  
