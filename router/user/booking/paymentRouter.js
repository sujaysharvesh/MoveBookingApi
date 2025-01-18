import Express from "express";
import { GetPaymentStatus, MakePayment } from "../../../controller/user/booking/paymentConroller.js";

const router = Express.Router()

router.post("/make-payment", MakePayment)

router.get('/payment-status', GetPaymentStatus)

export default router;
