import Express from "express";
import { CreateTheater, DeleteTheater, GetTheater, UpdateTheater } from "../../../controller/admin/theater/theaterController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/admin/theater/:
 *   get:
 *     summary: Get all theaters
 *     description: Retrieves a list of all theaters.
 *     responses:
 *       200:
 *         description: List of theaters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   location:
 *                     type: string
 *                   capacity:
 *                     type: integer
 */
router.get('/', GetTheater);

/**
 * @swagger
 * /api/admin/theater/create-theater:
 *   post:
 *     summary: Create a new theater
 *     description: Creates a new theater in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Cineplex Theater"
 *               location:
 *                 type: string
 *                 example: "Downtown, City"
 *               capacity:
 *                 type: integer
 *                 example: 500
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create-theater', CreateTheater);

/**
 * @swagger
 * /api/admin/theater/update-theater:
 *   patch:
 *     summary: Update theater details
 *     description: Updates the details of an existing theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Cineplex Deluxe"
 *               location:
 *                 type: string
 *                 example: "Uptown, City"
 *               capacity:
 *                 type: integer
 *                 example: 600
 *     responses:
 *       200:
 *         description: Theater updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Theater not found
 */
router.patch("/update-theater", UpdateTheater);

/**
 * @swagger
 * /api/admin/theater/delete-theater/{id}:
 *   delete:
 *     summary: Delete a theater
 *     description: Deletes a theater by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the theater to delete
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Theater deleted successfully
 *       404:
 *         description: Theater not found
 */
router.delete('/delete-theater/:id', DeleteTheater);

export default router;
