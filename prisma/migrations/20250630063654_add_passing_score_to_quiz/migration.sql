/*
  Warnings:

  - A unique constraint covering the columns `[difficulty,sequence]` on the table `Quiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "passingScore" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_difficulty_sequence_key" ON "Quiz"("difficulty", "sequence");
