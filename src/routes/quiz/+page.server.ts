import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';
import { initializeUserProgress } from '$lib/server/db/initializeUserProgress';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { user } = await getUser(event);
	if (!user) {
		throw redirect(302, '/sign-in');
	}
	const userId = user.id;

	await initializeUserProgress(userId);

	const quizzes = await prisma.quiz.findMany({
		where: { enabled: true },
		orderBy: [{ difficulty: 'asc' }, { sequence: 'asc' }],
		include: {
			QuizProgress: {
				where: { userId: userId },
				select: { status: true }
			}
		}
	});

	const quizzesWithProgress = quizzes.map((quiz) => ({
		id: quiz.id,
		title: quiz.title,
		difficulty: quiz.difficulty,
		sequence: quiz.sequence,
		prerequisiteId: quiz.prerequisiteId,
		status: quiz.QuizProgress[0]?.status || 'LOCKED'
	}));

	return {
		quizzes: quizzesWithProgress
	};
};
