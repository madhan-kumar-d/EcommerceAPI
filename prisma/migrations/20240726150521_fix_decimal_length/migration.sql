/*
  Warnings:

  - You are about to alter the column `netAmount` on the `order` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,3)`.
  - You are about to alter the column `price` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,3)`.
  - You are about to alter the column `MRP` on the `product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(15,3)`.

*/
-- AlterTable
ALTER TABLE `order` MODIFY `netAmount` DECIMAL(15, 3) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `price` DECIMAL(15, 3) NOT NULL,
    MODIFY `MRP` DECIMAL(15, 3) NOT NULL;
