/*
  Warnings:

  - The values [PENDING] on the enum `BridgeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BridgeStatus_new" AS ENUM ('AWAITING_PAYMENT', 'APPROVAL', 'COMPLETED', 'FAILED', 'REJECTED');
ALTER TABLE "BridgeTransfer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "BridgeTransfer" ALTER COLUMN "status" TYPE "BridgeStatus_new" USING ("status"::text::"BridgeStatus_new");
ALTER TYPE "BridgeStatus" RENAME TO "BridgeStatus_old";
ALTER TYPE "BridgeStatus_new" RENAME TO "BridgeStatus";
DROP TYPE "BridgeStatus_old";
ALTER TABLE "BridgeTransfer" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "BridgeTransfer" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
