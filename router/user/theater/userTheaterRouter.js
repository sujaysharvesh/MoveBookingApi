import Express from "express";
import { GetTheaterByCity, Search } from "../../../controller/user/theater/userTheaterController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/user/theaters:
 *   get:
 *     summary: Get theaters by city
 *     description: Retrieves a list of theaters in a specified city.
 *     parameters:
 *       - name: city
 *         in: query
 *         required: true
 *         description: The city to search for theaters
 *         schema:
 *           type: string
 *           example: "New York"
 *     responses:
 *       200:
 *         description: List of theaters in the city
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   theaterId:
 *                     type: integer
 *                     example: 1
 *                   theaterName:
 *                     type: string
 *                     example: "Cineplex"
 *                   city:
 *                     type: string
 *                     example: "New York"
 *       400:
 *         description: Invalid city name
 *       404:
 *         description: No theaters found in the city
 */
router.get("/theaters", GetTheaterByCity);

/**
 * @swagger
 * /api/user/search:
 *   get:
 *     summary: Search for theaters or movies
 *     description: Search for theaters or movies based on query parameters.
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search term to find theaters or movies
 *         schema:
 *           type: string
 *           example: "Avengers"
 *     responses:
 *       200:
 *         description: Search results for theaters or movies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Avengers: Endgame"
 *                       type:
 *                         type: string
 *                         example: "movie"
 *       400:
 *         description: Invalid search query
 *       404:
 *         description: No results found
 */
router.get("/search", Search);

export default router;
