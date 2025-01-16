import Express from "express";
import { CreateScreening, deleteScreening, updateScreening } from "../../../controller/admin/theater/screeningController.js";

const router  = Express.Router()

router.post("/create-screening", CreateScreening)

router.patch("/update-screening", updateScreening)

router.delete("/delete-screening", deleteScreening)


export default router;
