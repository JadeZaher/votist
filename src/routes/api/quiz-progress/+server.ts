import { json, error } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { userId } = locals.auth;

	if (!userId) {
		throw error(401, 'Unauthorized');
	}

	try {
		const quizProgress = await prisma.quizProgress.findMany({
			where: {
				userId
			},
			select: {
				status: true,
				quiz: {
					select: {
						id: true,
						title: true,
						difficulty: true,
						sequence: true,
						prerequisiteId: true,
						enabled: true
					}
				}
			},
			orderBy: {
				quiz: {
					sequence: 'asc'
				}
			}
		});

		const formattedQuizzes = quizProgress.map(({ quiz, status }) => ({
			...quiz,
			status
		}));

		return json(formattedQuizzes);
	} catch (err) {
		console.error('[QuizProgress] Error fetching quiz progress:', err);
		throw error(500, 'Failed to fetch quiz progress');
	}
};
