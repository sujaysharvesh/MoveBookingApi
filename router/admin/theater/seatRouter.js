import Express from "express";
import { CreateSeatLayout } from "../../../controller/admin/theater/seatController.js";

const router  = Express.Router()

router.get("/get-seat-details")

router.post("/add-seats", CreateSeatLayout)

router.patch("/update-seats")

router.delete("/delete-seats")

export default router;


