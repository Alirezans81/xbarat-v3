/*
  Warnings:

  - You are about to drop the column `documentUrl` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `documentUrl` on the `Withdrawal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "documentUrl";

-- AlterTable
ALTER TABLE "Withdrawal" DROP COLUMN "documentUrl";
