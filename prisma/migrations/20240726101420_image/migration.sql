/*
  Warnings:

  - The values [ACCEPTED] on the enum `order_status_orderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACCEPTED] on the enum `order_status_orderStatus` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `productImage` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userImage` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `orderStatus` ENUM('PENDING', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'ACCETPED', 'ORDER_IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `order_status` MODIFY `orderStatus` ENUM('PENDING', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'ACCETPED', 'ORDER_IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `productImage` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `userImage` VARCHAR(191) NOT NULL;
