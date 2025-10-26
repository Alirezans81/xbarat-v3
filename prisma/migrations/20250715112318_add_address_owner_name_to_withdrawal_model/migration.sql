/*
  Warnings:

  - Added the required column `addressOwnerName` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Withdrawal" ADD COLUMN     "addressOwnerName" TEXT NOT NULL;
