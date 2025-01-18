import Expresss from "express";
import { CreateScreen, DeleteScreen, GetScreen, UpdateScreen } from "../../../controller/admin/theater/screenController.js";

const router  = Expresss.Router()

router.get("/", GetScreen)

router.post("/create-screen", CreateScreen)

router.patch("/update-screen", UpdateScreen)

router.delete("/delete-screen", DeleteScreen)

export default router;
