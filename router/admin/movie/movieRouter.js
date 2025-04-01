import Express from "express";
import { CreateMovie, DeleteMovie, UpdateMovie, GetMovieDetail } from "../../../controller/admin/movie/movieController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/admin/movie:
 *   get:
 *     summary: Retrieve movie details
 *     description: Fetches the details of all movies.
 *     responses:
 *       200:
 *         description: A list of movies
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
 *                   title:
 *                     type: string
 *                     example: "Inception"
 *                   genre:
 *                     type: string
 *                     example: "Sci-Fi"
 *                   releaseDate:
 *                     type: string
 *                     format: date
 *                     example: "2010-07-16"
 */
router.get("/", GetMovieDetail);

/**
 * @swagger
 * /api/admin/movie/creat-movie:
 *   post:
 *     summary: Create a new movie
 *     description: Adds a new movie to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Interstellar"
 *               genre:
 *                 type: string
 *                 example: "Sci-Fi"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2014-11-07"
 *               director:
 *                 type: string
 *                 example: "Christopher Nolan"
 *     responses:
 *       201:
 *         description: Movie created successfully
 */
router.post("/creat-movie", CreateMovie);

/**
 * @swagger
 * /api/admin/movie/update-movie/{id}:
 *   patch:
 *     summary: Update a movie
 *     description: Updates the details of an existing movie.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the movie to update
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Interstellar (Updated)"
 *               genre:
 *                 type: string
 *                 example: "Sci-Fi"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2014-11-07"
 *     responses:
 *       200:
 *         description: Movie updated successfully
 */
router.patch("/update-movie/:id", UpdateMovie);

/**
 * @swagger
 * /api/admin/movie/delete-movie:
 *   delete:
 *     summary: Delete a movie
 *     description: Removes a movie from the database.
 *     parameters:
 *       - name: id
 *         in: query
 *         description: ID of the movie to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 */
router.delete("/delete-movie", DeleteMovie);

export default router;
