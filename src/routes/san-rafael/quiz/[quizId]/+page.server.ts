import { error } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';

export const load: ServerLoad = async ({ params }) => {
	const quizId = params.quizId;
	if (!quizId) {
		throw error(404, 'Quiz not found');
	}

	const quiz = await prisma.quiz.findUnique({
		where: { id: quizId },
		include: {
			questions: {
				orderBy: { createdAt: 'asc' }
			}
		}
	});

	if (!quiz) {
		throw error(404, 'Quiz not found');
	}

	// Normalize Question.options (JSON) and correctAnswer (JSON | null)
	const normalized = {
		...quiz,
		questions: quiz.questions.map((q: any) => ({
			...q,
			options: Array.isArray(q.options)
				? q.options
				: q.options && typeof q.options === 'object'
					? Object.values(q.options)
					: [],
			correctAnswer:
				q.correctAnswer &&
				typeof q.correctAnswer === 'object' &&
				Object.keys(q.correctAnswer).length > 0
					? q.correctAnswer
					: null
		}))
	};

	return { quiz: normalized };
};
