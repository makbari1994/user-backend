/*
  Warnings:

  - You are about to drop the `revokedtoken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropTable
DROP TABLE `revokedtoken`;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
