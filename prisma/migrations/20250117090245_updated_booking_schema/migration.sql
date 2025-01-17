/*
  Warnings:

  - A unique constraint covering the columns `[screenId,row,number]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `seatsId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "seatsId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_screenId_row_number_key" ON "Seat"("screenId", "row", "number");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_seatsId_fkey" FOREIGN KEY ("seatsId") REFERENCES "Seat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
