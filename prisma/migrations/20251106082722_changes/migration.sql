/*
  Warnings:

  - The values [EXCHANGE] on the enum `TransactionKind` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `currencyId` on table `FeeSetting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `fixedFee` on table `FeeSetting` required. This step will fail if there are existing NULL values in that column.
  - Made the column `percentageFee` on table `FeeSetting` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TransactionKind_new" AS ENUM ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'REFUND');
ALTER TABLE "FeeSetting" ALTER COLUMN "transactionType" TYPE "TransactionKind_new" USING ("transactionType"::text::"TransactionKind_new");
ALTER TYPE "TransactionKind" RENAME TO "TransactionKind_old";
ALTER TYPE "TransactionKind_new" RENAME TO "TransactionKind";
DROP TYPE "TransactionKind_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "FeeSetting" DROP CONSTRAINT "FeeSetting_currencyId_fkey";

-- AlterTable
ALTER TABLE "CurrencyPair" ADD COLUMN     "feePercentage" DECIMAL(65,30) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "FeeSetting" ADD COLUMN     "fromAmount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ADD COLUMN     "toAmount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
ALTER COLUMN "currencyId" SET NOT NULL,
ALTER COLUMN "fixedFee" SET NOT NULL,
ALTER COLUMN "percentageFee" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "FeeSetting" ADD CONSTRAINT "FeeSetting_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
