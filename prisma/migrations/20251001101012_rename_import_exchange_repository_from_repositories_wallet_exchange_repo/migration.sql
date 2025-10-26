/*
  Warnings:

  - You are about to drop the column `CurrencyPairId` on the `Exchange` table. All the data in the column will be lost.
  - Added the required column `currencyPairId` to the `Exchange` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_CurrencyPairId_fkey";

-- AlterTable
ALTER TABLE "Exchange" DROP COLUMN "CurrencyPairId",
ADD COLUMN     "currencyPairId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_currencyPairId_fkey" FOREIGN KEY ("currencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
