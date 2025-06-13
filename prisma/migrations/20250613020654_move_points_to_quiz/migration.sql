/*
  Warnings:

  - You are about to drop the column `points` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "points";

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 1;
