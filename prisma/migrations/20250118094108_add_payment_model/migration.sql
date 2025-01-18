-- CreateTable
CREATE TABLE "_TicketSeats" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketSeats_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketSeats_B_index" ON "_TicketSeats"("B");

-- AddForeignKey
ALTER TABLE "_TicketSeats" ADD CONSTRAINT "_TicketSeats_A_fkey" FOREIGN KEY ("A") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketSeats" ADD CONSTRAINT "_TicketSeats_B_fkey" FOREIGN KEY ("B") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
