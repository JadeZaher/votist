import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { user } = await getUser(event);
	if (!user) {
		throw redirect(302, '/sign-in');
	}

	const quizId = event.params.id;
	if (!quizId) {
		throw error(404, 'Quiz not found');
	}

	const quiz = await prisma.quiz.findUnique({
		where: { id: quizId },
		include: {
			questions: {
				include: {},
				orderBy: { createdAt: 'asc' }
			}
		}
	});

	if (!quiz) {
		throw error(404, 'Quiz not found');
	}

	// const userProgress = await prisma.quizProgress.findUnique({
	// 	where: {
	// 		userId_quizId: {
	// 			userId: user.id,
	// 			quizId: quizId
	// 		}
	// 	}
	// });

	// if (!userProgress || userProgress.status === 'LOCKED') {
	// 	throw redirect(302, '/quiz');
	// }

	// if (userProgress.status === 'COMPLETED') {
	// 	const completion = await prisma.quizCompletion.findUnique({
	// 		where: {
	// 			userId_quizId: {
	// 				userId: user.id,
	// 				quizId: quizId
	// 			}
	// 		}
	// 	});

	// if (completion) {
	// 	throw redirect(302, `/quiz/${quizId}/results`);
	// 	// }
	// }

	return {
		quiz
	};
};
