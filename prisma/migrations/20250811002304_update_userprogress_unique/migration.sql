/*
  Warnings:

  - A unique constraint covering the columns `[userId,quizId]` on the table `UserProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_quizId_key" ON "UserProgress"("userId", "quizId");
