/*
  Warnings:

  - Added the required column `MRP` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `MRP` DECIMAL(65, 30) NOT NULL;
