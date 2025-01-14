import Express from "express";
import { CreateMovie } from "../../../controller/admin/movie/movieController.js";

const router = Express.Router()

router.get("/movie-details")

router.post("/creat-movie", CreateMovie)

router.patch("/update-movie")

router.delete("/delete-movie")

export default router;

