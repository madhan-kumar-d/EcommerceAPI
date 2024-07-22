/*
  Warnings:

  - You are about to alter the column `orderStatus` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(2))`.
  - The values [PENDIFNG] on the enum `order_status_orderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Order` MODIFY `orderStatus` ENUM('PENDING', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'ACCEPTED', 'ORDER_IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `order_status` MODIFY `orderStatus` ENUM('PENDING', 'PAYMENT_PENDING', 'PAYMENT_COMPLETED', 'ACCEPTED', 'ORDER_IN_PROGRESS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED') NOT NULL;
