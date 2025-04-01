import Express from "express";
import { setSeatPrice, updateSeatPrice } from "../../../controller/admin/theater/seatPriceControllers.js";

const router = Express.Router();

/**
 * @swagger
 * /api/admin/theater/set-price:
 *   post:
 *     summary: Set price for a seat
 *     description: Sets the price for a specific seat in the theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatType:
 *                 type: string
 *                 example: "VIP"
 *               price:
 *                 type: number
 *                 example: 500
 *               theaterId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Seat price set successfully
 *       400:
 *         description: Invalid input
 */
router.post("/set-price", setSeatPrice);

/**
 * @swagger
 * /api/admin/theater/update-seat-price:
 *   patch:
 *     summary: Update seat price
 *     description: Updates the price for a specific seat in the theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               seatType:
 *                 type: string
 *                 example: "VIP"
 *               price:
 *                 type: number
 *                 example: 600
 *               theaterId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       200:
 *         description: Seat price updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Seat or theater not found
 */
router.patch("/update-seat-price", updateSeatPrice);

export default router;
