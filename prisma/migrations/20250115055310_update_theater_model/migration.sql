/*
  Warnings:

  - You are about to drop the column `pinCode` on the `Theater` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Theater` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Theater" DROP COLUMN "pinCode",
DROP COLUMN "state";
