import Express from "express";
import { CreateTheater, DeleteTheater, GetTheater, UpdateTheater } from "../../../controller/admin/theater/theaterController.js";

const router = Express.Router()

router.get('/theater-details', GetTheater)

router.post('/create-theater', CreateTheater)

router.patch("/update-theater", UpdateTheater)

router.delete('/delete-theater/:id', DeleteTheater)

export default router;
