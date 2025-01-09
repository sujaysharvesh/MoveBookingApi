import Express from "express";
import passport from "../../middleware/OAuth/passport.js";
import { loginSuccess, logout } from "../../controller/user/googleAuthController.js";


const router  = Express.Router()

router.get("/google", passport.authenticate('google', {scope: ['profile', 'email']}))

router.get("/google/callback", 
           passport.authenticate('google', {failureRedirect: "/"}),
           (req, res) => {
            res.redirect("/auth/success");
           }
)

router.get('/success', loginSuccess)

router.get('/logout', logout)

export default router;
