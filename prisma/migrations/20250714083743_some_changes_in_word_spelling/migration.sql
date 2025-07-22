/*
  Warnings:

  - You are about to drop the column `LiquidityPoolId` on the `BridgeTransfer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BridgeTransfer" DROP CONSTRAINT "BridgeTransfer_LiquidityPoolId_fkey";

-- AlterTable
ALTER TABLE "BridgeTransfer" DROP COLUMN "LiquidityPoolId",
ADD COLUMN     "liquidityPoolId" TEXT;

-- AddForeignKey
ALTER TABLE "BridgeTransfer" ADD CONSTRAINT "BridgeTransfer_liquidityPoolId_fkey" FOREIGN KEY ("liquidityPoolId") REFERENCES "LiquidityPool"("id") ON DELETE SET NULL ON UPDATE CASCADE;
