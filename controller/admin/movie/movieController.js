import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";

export const CreateMovie = async (req, res) => {
  const createMovieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    duration: z.number().int().positive("Duration must be a positive number"),
    releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid release date format. Use YYYY-MM-DD.",
    }),
    language: z.string().min(1, "Language is required"),
    posterUrl: z.string().url().optional(),
    trailerUrl: z.string().url().optional(),
    genre: z.array(z.enum([
      "ACTION", "ADVENTURE", "COMEDY", "DRAMA", "HORROR", "SCIFI", "THRILLER",
      "ROMANCE", "DOCUMENTARY", "ANIMATION", "CRIME", "FANTASY", "FAMILY",
    ])).min(1, "At least one genre is required"),
  });

  try {
    const valiDate = createMovieSchema.parse(req.body);

    const movieExists = await prisma.movie.findFirst({ where: { title: valiDate.title } });
    if (movieExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Movie with title "${title}" already exists` });
    }

    const newMovie = await prisma.movie.create({
      data: {
        ...valiDate,
      },
    });

    return res.status(StatusCodes.CREATED).json(newMovie);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while creating the movie",
      error: err,
    });
  }
};


export const GetMovieDetail = async (req, res) => {
  const getMovieDetailSchema = z.object({
    title: z.string().min(1, "Movie title is required"),
  });

  try {
    const { title } = getMovieDetailSchema.parse(req.body);

    const movieDetail = await prisma.movie.findMany({ 
                      where: { title },
                      include: { screenings: true, reviews: true } });
    if (movieDetail.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Movie not found" });
    }

    return res.status(StatusCodes.OK).json(movieDetail);
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err });
  }
};

export const UpdateMovie = async(req, res) => {
  const updateMovieSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    duration: z.number().int().positive().optional(),
    releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid release date format. Use YYYY-MM-DD.",
    }).optional(),
    language: z.string().min(1).optional(),
    posterUrl: z.string().url().optional(),
    trailerUrl: z.string().url().optional(),
    genre: z.array(z.enum([
      "ACTION", "ADVENTURE", "COMEDY", "DRAMA", "HORROR", "SCIFI", "THRILLER",
      "ROMANCE", "DOCUMENTARY", "ANIMATION", "CRIME", "FANTASY", "FAMILY",
    ])).min(1).optional(),
  });
  try{
    const validData = updateMovieSchema.parse(req.body);
  }
  catch(err){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went wrong"})
  }
};

export const DeleteMovie = async(req, res) => {
  try{
    const { id } = req.params;
    const movieExits = await prisma.movie.findUnique({where: { id }})
    if(!movieExits){
      res.status(StatusCodes.NOT_FOUND).json("movie Not found")
    }
    const deleteMovie = await prisma.movie.delete({ where: { id }})
    res.status(StatusCodes.OK).json({message: "Movie Deleted succussfully"})
  }
  catch(err){
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({message: "Something went Wrong", error:err})
  }
};
