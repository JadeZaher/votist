-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "prerequisiteId" TEXT,
ADD COLUMN     "sequence" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "QuizCompletion" ADD COLUMN     "userClerkId" TEXT;

-- CreateTable
CREATE TABLE "QuizProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "status" "QuizStatus" NOT NULL DEFAULT 'LOCKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userClerkId" TEXT,

    CONSTRAINT "QuizProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "clerkId" TEXT NOT NULL,
    "email" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("clerkId")
);

-- CreateIndex
CREATE INDEX "QuizProgress_userId_status_idx" ON "QuizProgress"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "QuizProgress_userId_quizId_key" ON "QuizProgress"("userId", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Quiz_difficulty_sequence_idx" ON "Quiz"("difficulty", "sequence");

-- CreateIndex
CREATE INDEX "Quiz_prerequisiteId_idx" ON "Quiz"("prerequisiteId");

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_prerequisiteId_fkey" FOREIGN KEY ("prerequisiteId") REFERENCES "Quiz"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizProgress" ADD CONSTRAINT "QuizProgress_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizProgress" ADD CONSTRAINT "QuizProgress_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizCompletion" ADD CONSTRAINT "QuizCompletion_userClerkId_fkey" FOREIGN KEY ("userClerkId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;
