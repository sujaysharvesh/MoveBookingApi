import Express from "express";
import { CreateMovie, DeleteMovie, UpdateMovie, GetMovieDetail } from "../../../controller/admin/movie/movieController.js";

const router = Express.Router()

router.get("/movie-details", GetMovieDetail)

router.post("/creat-movie", CreateMovie)

router.patch("/update-movie/:id", UpdateMovie)

router.delete("/delete-movie", DeleteMovie)

export default router;

