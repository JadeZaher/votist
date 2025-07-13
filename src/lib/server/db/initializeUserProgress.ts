import { prisma } from './prisma';

export async function initializeUserProgress(userId: string) {
	const firstQuiz = await prisma.quiz.findFirst({
		where: {
			prerequisiteId: null,
			enabled: true
		},
		orderBy: { sequence: 'asc' }
	});

	if (firstQuiz) {
		await prisma.quizProgress.upsert({
			where: {
				userId_quizId: {
					userId,
					quizId: firstQuiz.id
				}
			},
			update: {},
			create: {
				userId,
				quizId: firstQuiz.id,
				status: 'AVAILABLE'
			}
		});
	}
}
