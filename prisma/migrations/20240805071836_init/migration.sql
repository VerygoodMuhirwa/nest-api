/*
  Warnings:

  - You are about to drop the column `lastname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastname",
ADD COLUMN     "lastName" TEXT;
