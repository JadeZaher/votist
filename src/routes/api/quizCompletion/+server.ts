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

		const { quizId, score, answers, completed } = await event.request.json();

		const completion = await prisma.quizCompletion.create({
			data: {
				userId,
				quizId,
				score,
				answers,
				completed,
				completedAt: completed ? new Date() : null
			}
		});

		// Update progress to COMPLETED if the quiz is finished
		if (completed) {
			await prisma.quizProgress.update({
				where: {
					userId_quizId: {
						userId,
						quizId
					}
				},
				data: { status: 'COMPLETED' }
			});

			const nextQuiz = await prisma.quiz.findFirst({
				where: { prerequisiteId: quizId },
				orderBy: { sequence: 'asc' }
			});

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

		return json(completion);
	} catch (error) {
		console.error('Error submitting quiz completion:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
