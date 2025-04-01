import Express from "express";
import { CreateBooking, GetBookingDetails } from "../../../controller/user/booking/bookingController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/user/book-ticket:
 *   post:
 *     summary: Book a movie ticket
 *     description: Allows a user to book a movie ticket.
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
 *               theaterId:
 *                 type: integer
 *                 example: 101
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               screeningId:
 *                 type: integer
 *                 example: 789
 *     responses:
 *       201:
 *         description: Ticket booked successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Movie, theater, or screening not found
 */
router.post("/book-ticket", CreateBooking);

/**
 * @swagger
 * /api/user/booking-details:
 *   get:
 *     summary: Get booking details
 *     description: Retrieves the details of a user's booking.
 *     parameters:
 *       - name: userId
 *         in: query
 *         required: true
 *         description: ID of the user to fetch booking details for
 *         schema:
 *           type: integer
 *           example: 123
 *     responses:
 *       200:
 *         description: Booking details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: integer
 *                   example: 1
 *                 movie:
 *                   type: string
 *                   example: "The Avengers"
 *                 seats:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 2, 3]
 *                 totalPrice:
 *                   type: number
 *                   example: 1500
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: Booking not found
 */
router.get("/booking-details", GetBookingDetails);

export default router;
