/*
  Warnings:

  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `Images_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `image` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `images`;
