/*
  Warnings:

  - A unique constraint covering the columns `[address]` on the table `Theater` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'RESERVED', 'UNAVAILABLE');

-- DropIndex
DROP INDEX "Theater_name_key";

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AlterTable
ALTER TABLE "Theater" ALTER COLUMN "contactNumber" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Theater_address_key" ON "Theater"("address");
