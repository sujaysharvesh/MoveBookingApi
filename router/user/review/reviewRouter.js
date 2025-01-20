import Express from "express";
import { UpdateReview, addReview } from "../../../controller/user/review/reviewController.js";

const router  = Express.Router()

router.post("/add-review", addReview)

router.patch("/update-review", UpdateReview)

export default router;
