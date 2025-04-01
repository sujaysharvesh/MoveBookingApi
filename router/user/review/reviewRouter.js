import Express from "express";
import { UpdateReview, addReview } from "../../../controller/user/review/reviewController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/user/add-review:
 *   post:
 *     summary: Add a review for a movie
 *     description: Allows a user to add a review for a movie they watched.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               movieId:
 *                 type: integer
 *                 example: 456
 *               rating:
 *                 type: integer
 *                 example: 5
 *               reviewText:
 *                 type: string
 *                 example: "Great movie, highly recommend!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Movie or user not found
 */
router.post("/add-review", addReview);

/**
 * @swagger
 * /api/user/update-review:
 *   patch:
 *     summary: Update an existing review
 *     description: Allows a user to update a review they previously added.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 123
 *               movieId:
 *                 type: integer
 *                 example: 456
 *               rating:
 *                 type: integer
 *                 example: 4
 *               reviewText:
 *                 type: string
 *                 example: "Good movie, but could have been better."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Review or movie not found
 */
router.patch("/update-review", UpdateReview);

export default router;
