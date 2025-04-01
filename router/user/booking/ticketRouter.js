
import Express from "express";
import { CreateTicket } from "../../../controller/user/booking/ticketController.js";

const router = Express.Router();

/**
 * @swagger
 * /api/user/create-ticket:
 *   post:
 *     summary: Create a ticket
 *     description: Creates a new movie ticket for a booking.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookingId:
 *                 type: integer
 *                 example: 1
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               ticketType:
 *                 type: string
 *                 example: "VIP"
 *               price:
 *                 type: number
 *                 example: 500
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Booking not found
 */
router.post('/create-ticket', CreateTicket);

export default router;
