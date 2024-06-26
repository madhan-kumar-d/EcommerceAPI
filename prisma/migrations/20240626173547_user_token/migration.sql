/*
  Warnings:

  - A unique constraint covering the columns `[uniqueID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `uniqueID` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `uniqueID` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_uniqueID_key` ON `User`(`uniqueID`);
