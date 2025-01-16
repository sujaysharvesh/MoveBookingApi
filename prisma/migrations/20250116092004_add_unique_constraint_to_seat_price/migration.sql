/*
  Warnings:

  - You are about to alter the column `price` on the `SeatPrice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Integer`.
  - A unique constraint covering the columns `[screeningId,category]` on the table `SeatPrice` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SeatPrice" ALTER COLUMN "price" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "SeatPrice_screeningId_category_key" ON "SeatPrice"("screeningId", "category");
