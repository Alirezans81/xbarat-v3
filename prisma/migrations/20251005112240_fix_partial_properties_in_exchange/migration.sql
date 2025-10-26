/*
  Warnings:

  - You are about to drop the column `isPartial` on the `Exchange` table. All the data in the column will be lost.
  - Made the column `toAmount` on table `Exchange` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Exchange" DROP COLUMN "isPartial",
ALTER COLUMN "toAmount" SET NOT NULL,
ALTER COLUMN "matchedAmount" DROP DEFAULT,
ALTER COLUMN "remainingAmount" DROP DEFAULT;
