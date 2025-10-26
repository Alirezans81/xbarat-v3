/*
  Warnings:

  - You are about to drop the column `paymentChannelId` on the `BridgeTransfer` table. All the data in the column will be lost.
  - You are about to drop the column `bridgeTransferid` on the `Deposit` table. All the data in the column will be lost.
  - You are about to drop the column `bridgeTransferid` on the `Withdrawal` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BridgeTransfer" DROP CONSTRAINT "BridgeTransfer_paymentChannelId_fkey";

-- DropForeignKey
ALTER TABLE "Deposit" DROP CONSTRAINT "Deposit_bridgeTransferid_fkey";

-- DropForeignKey
ALTER TABLE "Withdrawal" DROP CONSTRAINT "Withdrawal_bridgeTransferid_fkey";

-- DropIndex
DROP INDEX "BridgeTransfer_paymentChannelId_key";

-- AlterTable
ALTER TABLE "BridgeTransfer" DROP COLUMN "paymentChannelId";

-- AlterTable
ALTER TABLE "Deposit" DROP COLUMN "bridgeTransferid";

-- AlterTable
ALTER TABLE "Withdrawal" DROP COLUMN "bridgeTransferid",
ADD COLUMN     "bridgeTransferId" TEXT;

-- AddForeignKey
ALTER TABLE "BridgeTransfer" ADD CONSTRAINT "BridgeTransfer_depositId_fkey" FOREIGN KEY ("depositId") REFERENCES "Deposit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BridgeTransfer" ADD CONSTRAINT "BridgeTransfer_withdrawalId_fkey" FOREIGN KEY ("withdrawalId") REFERENCES "Withdrawal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
