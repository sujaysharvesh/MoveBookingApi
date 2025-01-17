import Express from "express";
import { CreateBooking, GetBookingDetails } from "../../../controller/user/booking/bookingController.js";

const router = Express.Router()

router.post("/book-ticket", CreateBooking)

router.get("/booking-details", GetBookingDetails)

export default router;
