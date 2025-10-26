/*
  Warnings:

  - You are about to alter the column `fromAmount` on the `Exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,8)`.
  - You are about to alter the column `toAmount` on the `Exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,8)`.
  - You are about to alter the column `exchangeRate` on the `Exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,8)`.

*/
-- AlterEnum
ALTER TYPE "ExchangeStatus" ADD VALUE 'PARTIAL';

-- AlterTable
ALTER TABLE "Exchange" ADD COLUMN     "isPartial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchedAmount" DECIMAL(20,8) NOT NULL DEFAULT 0.00,
ADD COLUMN     "remainingAmount" DECIMAL(20,8) NOT NULL DEFAULT 0.00,
ALTER COLUMN "fromAmount" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "toAmount" SET DATA TYPE DECIMAL(20,8),
ALTER COLUMN "exchangeRate" SET DATA TYPE DECIMAL(20,8);
