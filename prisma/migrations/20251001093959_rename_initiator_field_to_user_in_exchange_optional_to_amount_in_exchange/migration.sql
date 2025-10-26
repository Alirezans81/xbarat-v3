/*
  Warnings:

  - You are about to drop the column `fromCurrencyId` on the `Exchange` table. All the data in the column will be lost.
  - You are about to drop the column `toCurrencyId` on the `Exchange` table. All the data in the column will be lost.
  - Added the required column `CurrencyPairId` to the `Exchange` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Exchange` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_fromCurrencyId_fkey";

-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_toCurrencyId_fkey";

-- DropForeignKey
ALTER TABLE "Exchange" DROP CONSTRAINT "Exchange_userId_fkey";

-- AlterTable
ALTER TABLE "Exchange" DROP COLUMN "fromCurrencyId",
DROP COLUMN "toCurrencyId",
ADD COLUMN     "CurrencyPairId" TEXT NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "toAmount" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_CurrencyPairId_fkey" FOREIGN KEY ("CurrencyPairId") REFERENCES "CurrencyPair"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
