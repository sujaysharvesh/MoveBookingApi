
import  Express  from "express";
import { CreateTicket } from "../../../controller/user/booking/ticketController.js";

const router = Express.Router()

router.post('/create-ticket', CreateTicket)

export default router;

