import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { z }  from "zod"

export const CreateCity = async(req, res) => {
    const cityCreateSchema = z.object({
      name: z.string().min(1, "city name required"),
      pincode: z.string().regex(/^\d{6}$/, "Invalid PinCode"),
      state: z.string().min(1, "State is required")
    })
    try{
    const validData = cityCreateSchema.parse(req.body);
    const cityExists = await prisma.city.findUnique({ where: { name: validData.name } })
    if(cityExists){
        res.status(StatusCodes.BAD_REQUEST).json(`${validData.name} already exists`)
    }
    const newCity = await prisma.city.create({
                             data: { name: validData.name, pincode: parseInt(validData.pincode), state: validData.state },
                             include: { theaters: true } })
    res.status(StatusCodes.CREATED).json({message: "City Created", data:newCity})
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong", error: err})
    }
}

export const UpdateCity = async (req, res) => {
    const cityUpdateSchema = z.object({
      name: z.string().min(1, "city name required").optional(),
      pincode: z.string().regex(/^\d{6}$/, "Invalid PinCode").optional(),
      state: z.string().min(1, "State is required").optional()
    })
    try {
      const { id } = req.params;
      const validData = cityUpdateSchema.parse(req.body);
      const city = await prisma.city.findUnique({ where: { id } });
      if (!city) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "City not found" });
      }
  
      const updatedCity = await prisma.city.update({
        where: { id },
        data: { validData },
      });
  
      return res.status(StatusCodes.OK).json({ message: "City updated successfully", updatedCity });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error: err.message });
    }
  };
  
  export const DeleteCity = async (req, res) => {
    try {
      const { id } = req.body;
      const cityExists = await prisma.city.findUnique({ where: { id } });
      if (!cityExists) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "City not found" });
      }
  
      await prisma.city.delete({
        where: { id },
      });
  
      return res.status(StatusCodes.OK).json({ message: "City deleted successfully" });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error: err.message });
    }
  };
  
  
  export const GetCity = async (req, res) => {
    try {
      const { name } = req.params;
      if (name) {
        const city = await prisma.city.findUnique({
          where: { name },
          include: {
            theaters: true, 
          },
        });
  
        if (!city) {
          return res.status(StatusCodes.NOT_FOUND).json({ message: "City not found" });
        }
  
        return res.status(StatusCodes.OK).json(city);
      } else {
        const cities = await prisma.city.findMany({ include: {theaters: true} });
        return res.status(StatusCodes.OK).json(cities);
      }
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error: err.message });
    }
  };
  