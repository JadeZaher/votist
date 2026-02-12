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

/**
 * Check if a user meets a post's quiz gate requirements
 * @param userId - The Clerk user ID
 * @param post - Post object with quiz gate fields
 * @returns Object with allowed boolean and message string
 */
export async function userMeetsPostQuizGate(
	userId: string,
	post: {
		quizGateType: string;
		quizGateDifficulty: QuizDifficulty | null;
		quizGateQuizId: string | null;
	}
): Promise<{ allowed: boolean; message: string }> {
	// No gate or NONE type - allow access
	if (!post.quizGateType || post.quizGateType === 'NONE') {
		return { allowed: true, message: '' };
	}

	// DIFFICULTY gate - must complete ALL quizzes at and below the required difficulty
	if (post.quizGateType === 'DIFFICULTY') {
		if (!post.quizGateDifficulty) {
			return { allowed: true, message: '' };
		}

		const requiredLevel = difficultyHierarchy[post.quizGateDifficulty];

		// Get all difficulties at or below the required level
		const requiredDifficulties: QuizDifficulty[] = [];
		for (const [difficulty, level] of Object.entries(difficultyHierarchy)) {
			if (level <= requiredLevel) {
				requiredDifficulties.push(difficulty as QuizDifficulty);
			}
		}

		// Find all quizzes at these difficulty levels
		const allRequiredQuizzes = await prisma.quiz.findMany({
			where: {
				difficulty: {
					in: requiredDifficulties
				}
			}
		});

		if (allRequiredQuizzes.length === 0) {
			return { allowed: true, message: '' };
		}

		// Get user's completed quizzes
		const userProgress = await prisma.userProgress.findMany({
			where: {
				userId,
				quizId: {
					in: allRequiredQuizzes.map((q) => q.id)
				},
				isCompleted: true
			},
			include: {
				quiz: true
			}
		});

		// Check if user has passed ALL required quizzes
		const passedQuizIds = new Set(
			userProgress
				.filter((progress) => progress.quizScore >= progress.quiz.passingScore)
				.map((progress) => progress.quizId)
		);

		const allQuizzesPassed = allRequiredQuizzes.every((quiz) => passedQuizIds.has(quiz.id));

		if (!allQuizzesPassed) {
			const missingCount = allRequiredQuizzes.length - passedQuizIds.size;
			return {
				allowed: false,
				message: `You must complete all quizzes at ${post.quizGateDifficulty} level and below (${missingCount} remaining)`
			};
		}

		return { allowed: true, message: '' };
	}

	// SPECIFIC_QUIZ gate - must complete the specific quiz
	if (post.quizGateType === 'SPECIFIC_QUIZ') {
		if (!post.quizGateQuizId) {
			return { allowed: true, message: '' };
		}

		const quiz = await prisma.quiz.findUnique({
			where: { id: post.quizGateQuizId }
		});

		if (!quiz) {
			return { allowed: true, message: '' };
		}

		const userProgress = await prisma.userProgress.findUnique({
			where: {
				userId_quizId: {
					userId,
					quizId: post.quizGateQuizId
				}
			}
		});

		const hasPassed =
			userProgress &&
			userProgress.isCompleted &&
			userProgress.quizScore >= quiz.passingScore;

		if (!hasPassed) {
			return {
				allowed: false,
				message: `You must complete the quiz "${quiz.title}" to access this post`
			};
		}

		return { allowed: true, message: '' };
	}

	// Unknown gate type - allow by default
	return { allowed: true, message: '' };
}

/**
 * Get human-readable information about a post's quiz gate
 * @param post - Post object with quiz gate fields
 * @returns Object with gate type, description, and optional quiz title
 */
export async function getPostQuizGateInfo(post: {
	quizGateType: string;
	quizGateDifficulty: QuizDifficulty | null;
	quizGateQuizId: string | null;
}): Promise<{ gateType: string; description: string; quizTitle?: string }> {
	if (!post.quizGateType || post.quizGateType === 'NONE') {
		return {
			gateType: 'NONE',
			description: 'No quiz required'
		};
	}

	if (post.quizGateType === 'DIFFICULTY') {
		if (!post.quizGateDifficulty) {
			return {
				gateType: 'NONE',
				description: 'No quiz required'
			};
		}

		return {
			gateType: 'DIFFICULTY',
			description: `Complete all quizzes at ${post.quizGateDifficulty} level and below`
		};
	}

	if (post.quizGateType === 'SPECIFIC_QUIZ') {
		if (!post.quizGateQuizId) {
			return {
				gateType: 'NONE',
				description: 'No quiz required'
			};
		}

		const quiz = await prisma.quiz.findUnique({
			where: { id: post.quizGateQuizId },
			select: { title: true }
		});

		return {
			gateType: 'SPECIFIC_QUIZ',
			description: quiz
				? `Complete the quiz: ${quiz.title}`
				: 'Complete a specific quiz',
			quizTitle: quiz?.title
		};
	}

	return {
		gateType: 'UNKNOWN',
		description: 'Unknown gate type'
	};
}
