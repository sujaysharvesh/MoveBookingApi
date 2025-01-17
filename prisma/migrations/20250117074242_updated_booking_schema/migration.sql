/*
  Warnings:

  - You are about to drop the column `bookingNumber` on the `Booking` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Booking_bookingNumber_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingNumber";
