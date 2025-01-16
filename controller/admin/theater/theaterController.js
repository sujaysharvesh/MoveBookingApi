import prisma from "../../../utils/prisma.js";
import StatusCodes from "http-status-codes";
import { NotFound } from "../../../middleware/OAuth/error/notFound.js";
import { z } from "zod";

export const CreateTheater = async (req, res) => {
  const theaterSchema = z.object({
    name: z.string().min(1, "Theater name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City Name is required"),
    contactNumber: z
      .string()
      .regex(/^\d{10}$/, "Contact number must be a valid 10-digit number"),
    email: z.string().email("Invalid email address"),
  });

  try {
    const validateData = theaterSchema.parse(req.body);

    const city = await prisma.city.findUnique({
      where: { name: validateData.city },
    });

    if (!city) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "City not found. Please provide a valid city name.",
      });
    }

    const theaterExists = await prisma.theater.findUnique({
      where: { address: validateData.address },
    });

    if (theaterExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "A theater with this name already exists.",
      });
    }

    const newTheater = await prisma.theater.create({
      data: {
        name: validateData.name,
        address: validateData.address,
        cityId: city.id,
        contactNumber: validateData.contactNumber,
        email: validateData.email,
      },
      include: {
        screens: true,
      },
    });

    res.status(StatusCodes.CREATED).json({
      message: "Theater created successfully",
      data: newTheater,
    });
  } catch (err) {
    if (err.name === "ZodError") {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "Validation failed",
            errors: err.errors, 
        });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message,
    });
  }
};

export const GetTheater = async (req, res) => {
  const getTheaterSchema = z.object({
    name: z.string().min(1, "Theater name is required"),
  });
  try {
    const validateData = getTheaterSchema.parse(req.body);
    if (!validateData.name) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Theater name required" });
    }
    const theaterExists = await prisma.theater.findFirst({
      where: { name: validateData.name },
      include: {
        screens: {
          include: {
            seatLayout: true
          }
        }
      }
    });
    if (!theaterExists) {
      throw new NotFound("Theater not Found");
    }
    res.status(StatusCodes.OK).json({ theaterExists });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong ", error: err });
  }
};

export const UpdateTheater = async (req, res) => {
  const updateTheaterSchema = z.object({
    name: z.string().min(1, "Theater name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City Name is required").optional(),
    totalScreens: z.number().int().positive().optional(),
    contactNumber: z
      .string()
      .regex(/^\d{10}$/, "Contact number must be a valid 10-digit number")
      .optional(),
    email: z.string().email("Invalid email address").optional(),
  });
  try {
    const validData = updateTheaterSchema.parse(req.body);
    const { id } = req.params;
    const theatetExists = await prisma.theater.findUnique({
      where: { id },
    });
    if (!theatetExists) {
      res.status(StatusCodes.NOT_FOUND).json("Theater Not Found");
    }
    const updatedTheater = await prisma.theater.update({
      where: { id: theatetExists.id },
      data: { 
        ...validData,
        cityId: validData.city ? await getCityId(validData.city) : undefined },
      include: { screens: true },
    });
    res.status(StatusCodes.OK).json({message: "Update theater succussfully", data: updatedTheater})
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went Wrong", error: err });
  }
};

export const DeleteTheater = async(req, res) => {
    const deleteTheaterSchema = z.object({
        id: z.string().min(1, "Provie valid Id")
    })
    try{
        const validData =  deleteTheaterSchema.parse(req.params);
        const theaterExists = await prisma.theater.findUnique({ where: { id: validData.id }})
        if(!theaterExists){
            throw new NotFound("Theater Not Found")
        }
        await prisma.theater.delete({where: { id: validData.id }})
        res.status(StatusCodes.OK).json({message: "Theater deleted successfully "})
    }
    catch(err){
        if (err.name === "ZodError") {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Validation failed",
                errors: err.errors, 
            });
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "something went wrong", error:err})
    }
}