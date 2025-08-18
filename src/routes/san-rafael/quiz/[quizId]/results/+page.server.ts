import { error } from '@sveltejs/kit';
import type { ServerLoad, RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';

export const load: ServerLoad = async (event) => {
	const quizId = event.params.quizId;
	if (!quizId) {
		throw error(404, 'Quiz not found');
	}

	// Get quiz data
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

	// Normalize Question.options and correctAnswer
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

	// Get user progress for this quiz
	let completion = null;
	let nextQuiz = null;
	try {
		const { user } = await getUser(event);
		if (user) {
			completion = await prisma.userProgress.findUnique({
				where: {
					userId_quizId: {
						userId: user.id,
						quizId
					}
				}
			});
		}
		// Optionally, find the next quiz (simple example)
		nextQuiz = await prisma.quiz.findFirst({
			where: { id: { not: quizId } },
			orderBy: { createdAt: 'asc' }
		});
	} catch (e) {
		// Ignore errors for progress/nextQuiz
	}

	return {
		quiz: normalized,
		completion,
		nextQuiz: nextQuiz
			? {
					id: nextQuiz.id,
					title: nextQuiz.title,
					difficulty: nextQuiz.difficulty || undefined
				}
			: undefined
	};
};
