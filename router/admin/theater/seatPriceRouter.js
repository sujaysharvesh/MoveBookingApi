import  Express  from "express";
import { setSeatPrice, updateSeatPrice } from "../../../controller/admin/theater/seatPriceControllers.js";

const router  = Express.Router()

router.post("/set-price", setSeatPrice)

router.patch('/update-seat-price', updateSeatPrice)


export default router;
