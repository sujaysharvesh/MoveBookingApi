import { StatusCodes } from "http-status-codes";
import prisma from "../../../utils/prisma.js";
import { z } from "zod";
import { connect } from "mongoose";

export const addReview = async (req, res) => {
  const addReviewSchema = z.object({
    ticketId: z.string().min(1, "Ticket ID is required"),
    rating: z.number().min(0).max(5),
    review: z.string().min(1, "Review must be more than 2 words").optional(),
  });

  try {
    const validateData = addReviewSchema.parse(req.body);
    const currentUser = req.user.userId;

    const ticketExist = await prisma.ticket.findUnique({
      where: { id: validateData.ticketId },
    });

    if (!ticketExist || ticketExist.userId !== currentUser) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "You are not allowed to review this movie" });
    }

    const movieExists = await prisma.screening.findUnique({
      where: { id: ticketExist.screeningId },
      include: { movie: true },
    });

    if (!movieExists || !movieExists.movie) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Movie does not exist for this ticket" });
    }

    const existingReviews = await prisma.review.findMany({
      where: { movieId: movieExists.movie.id },
    });

    const totalRating =
      existingReviews.reduce((sum, review) => sum + review.rating, 0) +
      validateData.rating;
    const avgRating = totalRating / (existingReviews.length + 1);

    const newReview = await prisma.review.create({
      data: {
        user: { connect: { id: currentUser } },
        movie: { connect: { id: movieExists.movie.id } },
        rating: validateData.rating,
        comment: validateData.review || null,
      },
    });

    await prisma.movie.update({
      where: { id: movieExists.movie.id },
      data: { rating: avgRating },
    });

    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Review added", data: newReview });
  } catch (err) {
    if (err.name === "ZodError") {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Validation error", error: err.errors });
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const UpdateReview = async (req, res) => {
    const updateReviewSchema = z.object({
      reviewId: z.string().min(1, "Review ID is required"),
      rating: z.number().min(0).max(5).optional(),
      review: z.string().min(1, "Review must be more than 2 words").optional(),
    });
  
    try {
      const validateData = updateReviewSchema.parse(req.body);
  
      const reviewExists = await prisma.review.findUnique({
        where: { id: validateData.reviewId },
      });
  
      if (!reviewExists) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Review not found" });
      }
  
      const updatedReview = await prisma.review.update({
        where: { id: validateData.reviewId },
        data: {
          rating: validateData.rating || reviewExists.rating,
          comment: validateData.review || reviewExists.comment,
        },
      });
  
      const existingReviews = await prisma.review.findMany({
        where: { movieId: reviewExists.movieId },
      });
  
      const totalRating = existingReviews.reduce(
        (sum, review) => sum + review.rating,
        0
      );
  
      const avgRating = totalRating / existingReviews.length;
  
      await prisma.movie.update({
        where: { id: reviewExists.movieId },
        data: { rating: avgRating },
      });
  
      return res
        .status(StatusCodes.OK)
        .json({ message: "Review updated successfully", data: updatedReview });
    } catch (err) {
      if (err.name === "ZodError") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Validation error", error: err.errors });
      }
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Something went wrong", error: err.message });
    }
  };
  