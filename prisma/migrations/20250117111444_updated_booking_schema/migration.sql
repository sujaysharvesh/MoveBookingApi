-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_seatsId_fkey";

-- CreateTable
CREATE TABLE "_BookingSeats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookingSeats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BookingSeats_B_index" ON "_BookingSeats"("B");

-- AddForeignKey
ALTER TABLE "_BookingSeats" ADD CONSTRAINT "_BookingSeats_A_fkey" FOREIGN KEY ("A") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookingSeats" ADD CONSTRAINT "_BookingSeats_B_fkey" FOREIGN KEY ("B") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
