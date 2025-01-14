import Express from "express";
import { CreateMovie, DeleteMovie, UpdateMovie, getMovieDetail } from "../../../controller/admin/movie/movieController.js";

const router = Express.Router()

router.get("/movie-details", getMovieDetail)

router.post("/creat-movie", CreateMovie)

router.patch("/update-movie", UpdateMovie)

router.delete("/delete-movie", DeleteMovie)

export default router;

