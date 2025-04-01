import Express from "express";
import { CreateSeatLayout } from "../../../controller/admin/theater/seatController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/admin/theater/add-seats:
 *   post:
 *     summary: Add seats to a theater
 *     description: Adds a new layout of seats to the theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layoutName:
 *                 type: string
 *                 example: "Standard Layout"
 *               numberOfSeats:
 *                 type: integer
 *                 example: 150
 *               theaterId:
 *                 type: integer
 *                 example: 101
 *     responses:
 *       201:
 *         description: Seat layout added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/add-seats", CreateSeatLayout);

/**
 * @swagger
 * /api/admin/theater/update-seats:
 *   patch:
 *     summary: Update seat layout
 *     description: Updates the layout or properties of the seats in the theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               layoutId:
 *                 type: integer
 *                 example: 1
 *               numberOfSeats:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       200:
 *         description: Seat layout updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Seat layout not found
 */
router.patch("/update-seats");

/**
 * @swagger
 * /api/admin/theater/delete-seats:
 *   delete:
 *     summary: Delete seat layout
 *     description: Deletes a seat layout from the theater.
 *     parameters:
 *       - name: layoutId
 *         in: query
 *         description: ID of the seat layout to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Seat layout deleted successfully
 *       404:
 *         description: Seat layout not found
 */
router.delete("/delete-seats");

export default router;
