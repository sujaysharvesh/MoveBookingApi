import { StatusCodes } from "http-status-codes";
import { InternalServerError } from "../../../error/internalServerError.js";
import prisma from "../../../utils/prisma.js";

export const CreateMovie = async (req, res) => {
    try {
      const {
        title,
        description,
        duration,
        releaseDate,
        language,
        posterUrl,
        trailerUrl,
        genre,
      } = req.body;
  
      if (!title || !description || !duration || !releaseDate || !language || !genre) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Provide all essential details about the movie" });
      }
  
      const movieExists = await prisma.movie.findUnique({ where: { title } });
      if (movieExists) {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: `Movie with the title "${title}" already exists` });
      }
  
      const newMovie = await prisma.movie.create({
        data: {
          title,
          description,
          duration,
          releaseDate,
          language,
          posterUrl,
          trailerUrl,
          genre,
        },
      });
      return res.status(StatusCodes.CREATED).json(newMovie);
    } catch (err) {
      throw new InternalServerError("Something went wrong while creating the movie")
    }
  };