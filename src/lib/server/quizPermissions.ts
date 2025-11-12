import { prisma } from '$lib/server/db/prisma';
import type { QuizDifficulty } from '@prisma/client';

const difficultyHierarchy: Record<QuizDifficulty, number> = {
	VOTIST: 1,
	SCHOLAR: 2,
	MENTOR: 3
};

/**
 * Check if a user has completed at least one quiz of the required difficulty level or higher
 * @param userId - The Clerk user ID
 * @param requiredDifficulty - The minimum quiz difficulty required
 * @returns true if the user meets the requirement, false otherwise
 */
export async function userMeetsQuizRequirement(
	userId: string,
	requiredDifficulty: QuizDifficulty | null
): Promise<boolean> {
	// If no difficulty is required, allow all authenticated users
	if (!requiredDifficulty) {
		return true;
	}

	const requiredLevel = difficultyHierarchy[requiredDifficulty];

	// Find all completed quizzes for this user
	const completedQuizzes = await prisma.userProgress.findMany({
		where: {
			userId,
			isCompleted: true
		},
		include: {
			quiz: true
		}
	});

	// Check if any completed quiz meets or exceeds the required difficulty
	return completedQuizzes.some((progress) => {
		const quiz = progress.quiz;
		// Also check that they passed the quiz
		if (progress.quizScore < quiz.passingScore) {
			return false;
		}

		// Check if quiz difficulty meets or exceeds the requirement
		if (quiz.difficulty) {
			const quizLevel = difficultyHierarchy[quiz.difficulty];
			return quizLevel >= requiredLevel;
		}

		return false;
	});
}

/**
 * Get the highest quiz difficulty level the user has completed
 * @param userId - The Clerk user ID
 * @returns The highest difficulty level completed, or null if none
 */
export async function getUserHighestCompletedDifficulty(
	userId: string
): Promise<QuizDifficulty | null> {
	const completedQuizzes = await prisma.userProgress.findMany({
		where: {
			userId,
			isCompleted: true
		},
		include: {
			quiz: true
		}
	});

	let highestLevel = 0;
	let highestDifficulty: QuizDifficulty | null = null;

	for (const progress of completedQuizzes) {
		const quiz = progress.quiz;
		// Only count quizzes they passed
		if (progress.quizScore >= quiz.passingScore && quiz.difficulty) {
			const level = difficultyHierarchy[quiz.difficulty];
			if (level > highestLevel) {
				highestLevel = level;
				highestDifficulty = quiz.difficulty;
			}
		}
	}

	return highestDifficulty;
}
