import Express from "express";
import { CreateScreening, deleteScreening, updateScreening } from "../../../controller/admin/theater/screeningController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/admin/theater/create-screening:
 *   post:
 *     summary: Create a new screening
 *     description: Adds a new movie screening to the theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 example: 1
 *               theaterId:
 *                 type: integer
 *                 example: 101
 *               screenId:
 *                 type: integer
 *                 example: 5
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-01T19:30:00"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-01T22:00:00"
 *     responses:
 *       201:
 *         description: Screening created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/create-screening", CreateScreening);

/**
 * @swagger
 * /api/admin/theater/update-screening:
 *   patch:
 *     summary: Update an existing screening
 *     description: Updates details of an existing movie screening.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               screeningId:
 *                 type: integer
 *                 example: 1
 *               movieId:
 *                 type: integer
 *                 example: 2
 *               theaterId:
 *                 type: integer
 *                 example: 102
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-01T20:00:00"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-06-01T22:30:00"
 *     responses:
 *       200:
 *         description: Screening updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Screening not found
 */
router.patch("/update-screening", updateScreening);

/**
 * @swagger
 * /api/admin/theater/delete-screening:
 *   delete:
 *     summary: Delete a screening
 *     description: Deletes an existing movie screening from the system.
 *     parameters:
 *       - name: screeningId
 *         in: query
 *         description: ID of the screening to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Screening deleted successfully
 *       404:
 *         description: Screening not found
 */
router.delete("/delete-screening", deleteScreening);

export default router;
