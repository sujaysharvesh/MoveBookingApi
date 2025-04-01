import Express from "express";
import passport from "../../middleware/OAuth/auth/passport.js";
import { loginSuccess, logout } from "../../controller/user/googleAuthController.js";

const router = Express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Redirects the user to Google's OAuth 2.0 authentication.
 *     responses:
 *       302:
 *         description: Redirects to Google authentication
 */
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles Google's authentication callback and redirects to success or failure.
 *     responses:
 *       302:
 *         description: Redirects to success or failure URL
 */
router.get("/google/callback", 
           passport.authenticate('google', { failureRedirect: "/" }),
           (req, res) => {
            res.redirect("/auth/success");
           }
);

/**
 * @swagger
 * /auth/success:
 *   get:
 *     summary: Google Authentication Success
 *     description: Returns user details upon successful Google authentication.
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Unauthorized access
 */
router.get('/success', loginSuccess);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout from Google authentication
 *     description: Logs out the authenticated user.
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized access
 */
router.get('/logout', logout);

export default router;
