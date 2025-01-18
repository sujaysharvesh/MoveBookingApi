import Express from "express";
import { GetTheaterByCity, Search } from "../../../controller/user/theater/userTheaterController.js";

const router  = Express.Router()

router.get("/theaters", GetTheaterByCity)

router.get("/search", Search)

export default router;
