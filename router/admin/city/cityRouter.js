import Express from "express";
import { CreateCity, DeleteCity, GetCity, UpdateCity } from "../../../controller/admin/city/cityController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/admin/city:
 *   get:
 *     summary: Retrieve all cities
 *     description: Fetches a list of all cities.
 *     responses:
 *       200:
 *         description: A list of cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "New York"
 */
router.get("/", GetCity);

/**
 * @swagger
 * /api/admin/city/create-city:
 *   post:
 *     summary: Create a new city
 *     description: Adds a new city to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Los Angeles"
 *     responses:
 *       201:
 *         description: City created successfully
 */
router.post("/create-city", CreateCity);

/**
 * @swagger
 * /api/admin/city/update-city:
 *   patch:
 *     summary: Update an existing city
 *     description: Updates the details of an existing city in the database.
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
 *                 example: "San Francisco"
 *     responses:
 *       200:
 *         description: City updated successfully
 */
router.patch("/update-city", UpdateCity);

/**
 * @swagger
 * /api/admin/city/delete-city:
 *   delete:
 *     summary: Delete a city
 *     description: Removes a city from the database.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the city to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: City deleted successfully
 */
router.delete("/delete-city", DeleteCity);

export default router;
