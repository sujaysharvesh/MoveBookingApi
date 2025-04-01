import Express from "express";
import { GetPaymentStatus, MakePayment } from "../../../controller/user/booking/paymentConroller.js";

const router = Express.Router();

/**
 * @swagger
 * /api/user/make-payment:
 *   post:
 *     summary: Make a payment for a booking
 *     description: Processes a payment for a movie ticket booking.
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
 *               amount:
 *                 type: number
 *                 example: 1500
 *               paymentMethod:
 *                 type: string
 *                 example: "credit-card"
 *               paymentDetails:
 *                 type: object
 *                 properties:
 *                   cardNumber:
 *                     type: string
 *                     example: "4111111111111111"
 *                   expiryDate:
 *                     type: string
 *                     example: "12/24"
 *                   cvv:
 *                     type: string
 *                     example: "123"
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Booking not found or payment method failed
 */
router.post("/make-payment", MakePayment);

/**
 * @swagger
 * /api/user/payment-status:
 *   get:
 *     summary: Get payment status
 *     description: Retrieves the status of a payment for a booking.
 *     parameters:
 *       - name: bookingId
 *         in: query
 *         required: true
 *         description: ID of the booking to fetch the payment status for
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookingId:
 *                   type: integer
 *                   example: 1
 *                 paymentStatus:
 *                   type: string
 *                   example: "success"
 *                 transactionId:
 *                   type: string
 *                   example: "abcd1234"
 *       400:
 *         description: Invalid booking ID
 *       404:
 *         description: Payment not found
 */
router.get('/payment-status', GetPaymentStatus);

export default router;
