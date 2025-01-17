/*
  Warnings:

  - Added the required column `screeningId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "screeningId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Booking_userId_screeningId_idx" ON "Booking"("userId", "screeningId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
