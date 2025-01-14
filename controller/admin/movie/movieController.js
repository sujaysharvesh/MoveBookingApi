import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";

export const CreateMovie = async (req, res) => {
  try {
    let {
      title,
      description,
      duration,
      releaseDate,
      language,
      posterUrl,
      trailerUrl,
      genre,
    } = req.body;

    if (
      !title ||
      !description ||
      !duration ||
      !releaseDate ||
      !language ||
      !genre
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Provide all essential details about the movie" });
    }

    if (isNaN(duration)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Duration must be a number" });
    }
    duration = parseInt(duration);
    const parsedDate = Date.parse(releaseDate);
    if (isNaN(parsedDate)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid release date format. Use YYYY-MM-DD." });
    }
    releaseDate = new Date(parsedDate);
    const validGenres = [
      "ACTION",
      "ADVENTURE",
      "COMEDY",
      "DRAMA",
      "HORROR",
      "SCIFI",
      "THRILLER",
      "ROMANCE",
      "DOCUMENTARY",
      "ANIMATION",
      "CRIME",
      "FANTASY",
      "FAMILY",
    ];

    if (!Array.isArray(genre) || !genre.every((g) => validGenres.includes(g))) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          error: `Invalid genres. Valid options are: ${validGenres.join(", ")}`,
        });
    }

    const movieExists = await prisma.movie.findFirst({ where: { title } });
    if (movieExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ error: `Movie with title "${title}" already exists` });
    }

    posterUrl = posterUrl || null;
    trailerUrl = trailerUrl || null;

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
    console.error("Error creating movie:", err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while creating the movie",
      error: err,
    });
  }
};

export const getMovieDetail = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Movie title is required" });
    }

    const movieDetail = await prisma.movie.findMany({ where: { title } });
    if (movieDetail.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Movie not found" });
    }

    return res.status(StatusCodes.OK).json(movieDetail);
  } catch (err) {
    console.error("Error fetching movie details:", err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err });
  }
};

export const UpdateMovie = async (req, res) => {
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
    const { id } = req.params;
    const movieExists = await prisma.movie.findUnique({ where: { id } });
    if (!movieExists) {
      res.status(StatusCodes.NOT_FOUND).join("Movie Not Found");
    }
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (duration) updateData.duration = parseInt(duration);
    if (releaseDate) {
      const parsedDate = Date.parse(releaseDate);
      if (isNaN(parsedDate)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Invalid release date format. Use YYYY-MM-DD." });
      }
      updateData.releaseDate = new Date(parsedDate);
    }
    if (language) updateData.language = language;
    if (posterUrl) updateData.posterUrl = posterUrl;
    if (trailerUrl) updateData.trailerUrl = trailerUrl;
    if (genre) updateData.genre = genre;
    const updateMovie = await prisma.movie.update({
      where: { id },
      data: { updateData },
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Update movie succussfully", data: updateMovie });
  } catch (err) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err });
  }
};


export const DeleteMovie = async (req, res) => {
  try {
    const { id } = req.body;

    const movieExists = await prisma.movie.findUnique({ where: { id } });
    if (!movieExists) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Movie Not Found" });
    }

    const deleteMovie = await prisma.movie.delete({
      where: { id },
    });

    return res
      .status(StatusCodes.OK)
      .json({
        message: "Movie deleted successfully",
        deletedMovie: deleteMovie,
      });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong",
      error: err.message || err,
    });
  }
};
