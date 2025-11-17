/*
  Warnings:

  - You are about to drop the column `feeWalletId` on the `ExchangeMatch` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExchangeMatch" DROP CONSTRAINT "ExchangeMatch_feeWalletId_fkey";

-- AlterTable
ALTER TABLE "ExchangeMatch" DROP COLUMN "feeWalletId";
