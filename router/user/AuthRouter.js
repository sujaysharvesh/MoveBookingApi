import Express from "express";
import { LogOut, RegisterUser, login } from "../../controller/user/user-controller.js";
import { AuthMiddleware } from "../../middleware/OAuth/user/userMiddleware.js";

const router = Express.Router()

router.post('/register', RegisterUser)

router.post('/login', login)

router.post('/logout', AuthMiddleware, LogOut)

export default router;
