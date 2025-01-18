import Express from "express";
import { CreateCity, DeleteCity, GetCity, UpdateCity } from "../../../controller/admin/city/cityController.js";

const router = Express.Router()

router.get("/", GetCity)

router.post("/create-city", CreateCity)

router.patch("/update-city", UpdateCity)

router.delete('/delete-city', DeleteCity)

export default router;
