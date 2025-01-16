import Express from "express";
import { GetTheaterByCity } from "../../../controller/user/theater/userTheaterController.js";

const router  = Express.Router()

router.get("/theaters", GetTheaterByCity)

export default router;
