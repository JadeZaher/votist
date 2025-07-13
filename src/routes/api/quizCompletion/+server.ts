import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

export const POST: RequestHandler = async (event: RequestEvent) => {
	try {
		const { user } = await getUser(event);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}
		const userId = user.id;

		const { quizId, score, answers, completed, passed } = await event.request.json();

		const completion = await prisma.quizCompletion.upsert({
			where: {
				userId_quizId: {
					userId,
					quizId
				}
			},
			update: {
				score,
				answers,
				completed,
				completedAt: completed ? new Date() : null
			},
			create: {
				userId,
				quizId,
				score,
				answers,
				completed,
				completedAt: completed ? new Date() : null
			}
		});

		if (completed) {
			const newStatus = passed ? 'COMPLETED' : 'AVAILABLE'; // Failed quizzes remain available for retry

			await prisma.quizProgress.upsert({
				where: {
					userId_quizId: {
						userId,
						quizId
					}
				},
				update: { status: newStatus },
				create: {
					userId,
					quizId,
					status: newStatus
				}
			});

			if (passed) {
				let nextQuiz = await prisma.quiz.findFirst({
					where: { prerequisiteId: quizId, enabled: true },
					orderBy: { sequence: 'asc' }
				});

				if (!nextQuiz) {
					const currentQuiz = await prisma.quiz.findUnique({
						where: { id: quizId },
						select: { difficulty: true, sequence: true }
					});

					if (currentQuiz) {
						nextQuiz = await prisma.quiz.findFirst({
							where: {
								difficulty: currentQuiz.difficulty,
								sequence: { gt: currentQuiz.sequence },
								enabled: true
							},
							orderBy: { sequence: 'asc' }
						});
					}
				}

				if (nextQuiz) {
					await prisma.quizProgress.upsert({
						where: {
							userId_quizId: {
								userId,
								quizId: nextQuiz.id
							}
						},
						update: { status: 'AVAILABLE' },
						create: {
							userId,
							quizId: nextQuiz.id,
							status: 'AVAILABLE'
						}
					});
				}
			}
		}

		return json(completion);
	} catch (error) {
		console.error('Error submitting quiz completion:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
