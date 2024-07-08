-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_id_fkey`;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
