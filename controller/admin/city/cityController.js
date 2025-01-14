import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";

export const CreateCity = async(req, res) => {
    try{
    const { city } = req.body;
    const cityExists = await prisma.city.findUnique({ where: {city} })
    if(cityExists){
        res.status(StatusCodes.BAD_REQUEST).json(`${city} already exists`)
    }
    const newCity = await prisma.city.create({data: { city }})
    res.status(StatusCodes.CREATED).json({message: "City Created", data:newCity})
    }
    catch(err){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong", error: err})
    }
}

export const UpdateCity = async (req, res) => {
    try {
      const { id, name } = req.body;
  
      const city = await prisma.city.findUnique({ where: { id } });
      if (!city) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "City not found" });
      }
  
      const updatedCity = await prisma.city.update({
        where: { id },
        data: {
          name: name || city.name, 
        },
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
        const cities = await prisma.city.findMany();
        return res.status(StatusCodes.OK).json(cities);
      }
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong", error: err.message });
    }
  };
  