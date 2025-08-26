import { prisma } from './prisma';

export async function initializeUserProgress(userId: string) {
	try {
		// Get all quizzes
		const quizzes = await prisma.quiz.findMany({
			select: { id: true, associatedMaterialId: true }
		});

		// Create UserProgress records for quizzes that don't have them yet
		const existingProgress = await prisma.userProgress.findMany({
			where: { userId },
			select: { quizId: true }
		});

		const existingQuizIds = new Set(existingProgress.map((p) => p.quizId));
		const quizzesToInitialize = quizzes.filter((quiz) => !existingQuizIds.has(quiz.id));

		if (quizzesToInitialize.length > 0) {
			await prisma.userProgress.createMany({
				data: quizzesToInitialize.map((quiz) => ({
					userId,
					quizId: quiz.id,
					materialId: quiz.associatedMaterialId || quiz.id, // Use associatedMaterialId if available, otherwise use quiz.id
					quizScore: 0,
					isCompleted: false
				}))
			});
		}
	} catch (error) {
		console.error('Error initializing user progress:', error);
		throw error;
	}
}
