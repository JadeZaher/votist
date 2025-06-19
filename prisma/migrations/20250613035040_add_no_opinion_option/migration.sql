/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Option` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "isCorrect" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Option_questionId_idx" ON "Option"("questionId");

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
