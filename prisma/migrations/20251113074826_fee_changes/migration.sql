/*
  Warnings:

  - You are about to drop the column `feePercentage` on the `Exchange` table. All the data in the column will be lost.
  - Added the required column `feeWalletId` to the `ExchangeMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exchange" DROP COLUMN "feePercentage",
ADD COLUMN     "fee" DECIMAL(65,30) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "ExchangeMatch" ADD COLUMN     "feeWalletId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ExchangeMatch" ADD CONSTRAINT "ExchangeMatch_feeWalletId_fkey" FOREIGN KEY ("feeWalletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
