/*
  Warnings:

  - You are about to drop the column `cartID` on the `order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_cartID_fkey`;

-- AlterTable
ALTER TABLE `cart_items` ADD COLUMN `orderId` BIGINT UNSIGNED NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `cartID`;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_id_fkey` FOREIGN KEY (`id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
