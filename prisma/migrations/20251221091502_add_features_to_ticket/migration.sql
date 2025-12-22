/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `TicketMessage` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderRole` to the `TicketMessage` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TicketMessage_ticketId_idx";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "unreadCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "TicketMessage" DROP COLUMN "isAdmin",
ADD COLUMN     "senderRole" "UserRole" NOT NULL;
