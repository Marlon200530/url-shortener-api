/*
  Warnings:

  - You are about to drop the column `click_count` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `custom_alias` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `short_code` on the `ShortUrl` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `original_url_text` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shortCode]` on the table `ShortUrl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customAlias]` on the table `ShortUrl` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shortCode` to the `ShortUrl` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalUrl` to the `Url` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ShortUrl_custom_alias_key";

-- DropIndex
DROP INDEX "ShortUrl_short_code_key";

-- AlterTable
ALTER TABLE "ShortUrl" DROP COLUMN "click_count",
DROP COLUMN "custom_alias",
DROP COLUMN "expires_at",
DROP COLUMN "short_code",
ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customAlias" TEXT,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "shortCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Url" DROP COLUMN "created_at",
DROP COLUMN "original_url_text",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "originalUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "password_hash",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_shortCode_key" ON "ShortUrl"("shortCode");

-- CreateIndex
CREATE UNIQUE INDEX "ShortUrl_customAlias_key" ON "ShortUrl"("customAlias");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
