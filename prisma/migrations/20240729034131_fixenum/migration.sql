/*
  Warnings:

  - The values [ACCETPED] on the enum `order_status_orderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [ACCETPED] on the enum `order_status_orderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `orderStatus` ENUM('PENDING', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'ACCEPTED', 'ORDER_IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `order_status` MODIFY `orderStatus` ENUM('PENDING', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'ACCEPTED', 'ORDER_IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') NOT NULL;
