import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { array, z } from "zod";

export const GetTheaterByCity = async (req, res) => {
  const theaterByCitySchema = z.object({
    city: z.string().min(1, "City Name is required"),
    limit: z.number().int().min(1).default(10),
    page: z.number().int().min(1).default(1),
  });
  try {
    const validateData = theaterByCitySchema.parse(req.body);
    const cityExists = await prisma.city.findUnique({
      where: { name: validateData.city },
    });
    if (!cityExists) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: `${validateData.city} not found` });
    }
    const offset = (validateData.page - 1) * validateData.limit;
    const theaters = await prisma.theater.findMany({
      where: { cityId: cityExists.id },
      take: validateData.limit,
      skip: offset,
      select: {
        name: true,
        address: true,
        screens: {
          select: {
            name: true,
            screenType: true,
            screenings: {
              select: {
                movie: {
                  select: {
                    title: true,
                    description: true,
                    language: true,
                    duration: true,
                    releaseDate: true,
                    genre: true,
                    rating: true,
                  },
                },
                price: {
                  select: {
                    category: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    const totalTheater = await prisma.theater.count({
      where: { cityId: cityExists.id },
    });
    if (!theaters || theaters.length === 0) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "No theaters found for the specified city" });
    }
    res.status(StatusCodes.OK).json({
      data: theaters,
      meta: {
        total: totalTheater,
        limit: validateData.limit,
        page: validateData.page,
        totalPage: Math.ceil(totalTheater / validateData.page),
      },
    });
  } catch (err) {
    if (err.name === "ZodError") {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "validation Error", error: err });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something Went Wrong", error: err.message });
  }
};

export const Search = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword || keyword.trim() === "") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Keyword is required" });
    }

    const theaters = await prisma.theater.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { address: { contains: keyword, mode: "insensitive" } },
          {
            city: {
              name: { contains: keyword, mode: "insensitive" },
            },
          },
          {
            screens: {
              some: {
                screenings: {
                  some: {
                    movie: {
                      title: { contains: keyword, mode: "insensitive" },
                    },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        city: {
          select: {
            name: true,
            pincode: true,
            state: true,
          },
        },
        screens: { 
          include: { 
            screenings: {
              include: {
                movie: {
                  select: {
                    title: true,
                    language: true,
                    releaseDate: true,
                    rating: true,
                    trailerUrl: true,
                    duration: true,
                    description: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    
    
    

    return res.status(StatusCodes.OK).json({
      message: "Search results fetched successfully",
      data: theaters,
    });
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message });
  }
};
