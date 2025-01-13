/*
  Warnings:

  - You are about to drop the column `published` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'UNPUBLISHED');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "published",
ADD COLUMN     "status" "PostStatus" NOT NULL DEFAULT 'DRAFT';
