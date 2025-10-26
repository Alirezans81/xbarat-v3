/*
  Warnings:

  - You are about to drop the column `matchedAmount` on the `ExchangeMatch` table. All the data in the column will be lost.
  - Added the required column `fromMatchedAmount` to the `ExchangeMatch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toMatchedAmount` to the `ExchangeMatch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExchangeMatch" DROP COLUMN "matchedAmount",
ADD COLUMN     "fromMatchedAmount" DECIMAL(20,8) NOT NULL,
ADD COLUMN     "toMatchedAmount" DECIMAL(20,8) NOT NULL;
