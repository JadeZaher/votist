/*
  Warnings:

  - You are about to drop the column `correctOptionId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `prerequisiteId` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the column `sequence` on the `Quiz` table. All the data in the column will be lost.
  - You are about to drop the `Option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizCompletion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuizProgress` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `correctAnswer` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `options` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_correctOptionId_fkey";

-- DropForeignKey
ALTER TABLE "Quiz" DROP CONSTRAINT "Quiz_prerequisiteId_fkey";

-- DropForeignKey
ALTER TABLE "QuizCompletion" DROP CONSTRAINT "QuizCompletion_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizCompletion" DROP CONSTRAINT "QuizCompletion_userClerkId_fkey";

-- DropForeignKey
ALTER TABLE "QuizProgress" DROP CONSTRAINT "QuizProgress_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizProgress" DROP CONSTRAINT "QuizProgress_userClerkId_fkey";

-- DropIndex
DROP INDEX "Question_correctOptionId_key";

-- DropIndex
DROP INDEX "Quiz_difficulty_sequence_idx";

-- DropIndex
DROP INDEX "Quiz_difficulty_sequence_key";

-- DropIndex
DROP INDEX "Quiz_prerequisiteId_idx";

-- AlterTable
ALTER TABLE "Question"
    DROP COLUMN "correctOptionId",
    DROP COLUMN "description",
    DROP COLUMN "title";

-- Add new columns with defaults for existing rows
ALTER TABLE "Question"
    ADD COLUMN "correctAnswer" JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN "options" JSONB NOT NULL DEFAULT '{}'::jsonb,
    ADD COLUMN "text" TEXT NOT NULL DEFAULT '',
    ADD COLUMN "type" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "Quiz" DROP COLUMN "difficulty",
DROP COLUMN "enabled",
DROP COLUMN "points",
DROP COLUMN "prerequisiteId",
DROP COLUMN "sequence",
ADD COLUMN     "associatedMaterialId" TEXT,
ALTER COLUMN "passingScore" DROP DEFAULT;

-- DropTable
DROP TABLE "Option";

-- DropTable
DROP TABLE "QuizCompletion";

-- DropTable
DROP TABLE "QuizProgress";

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "quizScore" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProgress_pkey" PRIMARY KEY ("id")
);
