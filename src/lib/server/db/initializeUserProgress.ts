import { prisma } from './prisma';

/**
 * Initialize user progress for all available quizzes
 * This function ensures that a user has UserProgress records for all quizzes
 * that they should have access to based on the quiz progression system
 */
export async function initializeUserProgress(userId: string): Promise<void> {
	try {
		// Get all quizzes ordered by difficulty and sequence
		const allQuizzes = await prisma.quiz.findMany({
			orderBy: [{ difficulty: 'asc' }, { order: 'asc' }],
			select: { id: true }
		});

		// Get existing user progress for this user
		const existingProgress = await prisma.userProgress.findMany({
			where: { userId },
			select: { quizId: true }
		});

		const existingQuizIds = new Set(existingProgress.map((p) => p.quizId));

		// Create UserProgress records for quizzes that don't have them yet
		const missingQuizzes = allQuizzes.filter((quiz) => !existingQuizIds.has(quiz.id));

		if (missingQuizzes.length > 0) {
			await prisma.userProgress.createMany({
				data: missingQuizzes.map((quiz) => ({
					userId,
					quizId: quiz.id,
					materialId: quiz.id, // Using quizId as materialId for now
					quizScore: 0,
					isCompleted: false
				})),
				skipDuplicates: true
			});
		}
	} catch (error) {
		console.error('Error initializing user progress:', error);
		throw error;
	}
}
