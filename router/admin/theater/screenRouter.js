import Expresss from "express";
import { CreateScreen, DeleteScreen, GetScreen, UpdateScreen } from "../../../controller/admin/theater/screenController.js";

const router = Expresss.Router();

/**
 * @swagger
 * /api/admin/theater/create-screen:
 *   post:
 *     summary: Create a new screen
 *     description: Adds a new screen to the theater.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               screenName:
 *                 type: string
 *                 example: "Screen 1"
 *               theaterId:
 *                 type: integer
 *                 example: 101
 *               capacity:
 *                 type: integer
 *                 example: 150
 *     responses:
 *       201:
 *         description: Screen created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/create-screen", CreateScreen);

/**
 * @swagger
 * /api/admin/theater/update-screen:
 *   patch:
 *     summary: Update an existing screen
 *     description: Updates details of an existing screen.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               screenId:
 *                 type: integer
 *                 example: 1
 *               screenName:
 *                 type: string
 *                 example: "Updated Screen"
 *               capacity:
 *                 type: integer
 *                 example: 200
 *     responses:
 *       200:
 *         description: Screen updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Screen not found
 */
router.patch("/update-screen", UpdateScreen);

/**
 * @swagger
 * /api/admin/theater/delete-screen:
 *   delete:
 *     summary: Delete a screen
 *     description: Deletes an existing screen from the system.
 *     parameters:
 *       - name: screenId
 *         in: query
 *         description: ID of the screen to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Screen deleted successfully
 *       404:
 *         description: Screen not found
 */
router.delete("/delete-screen", DeleteScreen);

/**
 * @swagger
 * /api/admin/theater/get-screen:
 *   get:
 *     summary: Get details of all screens
 *     description: Retrieves the list of all screens in the system.
 *     responses:
 *       200:
 *         description: A list of screens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   screenId:
 *                     type: integer
 *                     example: 1
 *                   screenName:
 *                     type: string
 *                     example: "Screen 1"
 *                   theaterId:
 *                     type: integer
 *                     example: 101
 *                   capacity:
 *                     type: integer
 *                     example: 150
 */
router.get("/", GetScreen);

export default router;
