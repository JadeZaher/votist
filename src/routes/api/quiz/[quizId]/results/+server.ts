import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	try {
		const { user } = await getUser(event);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const quizId = event.params.quizId;
		const progress = await prisma.userProgress.findUnique({
			where: {
				userId_quizId: {
					userId: user.id,
					quizId: quizId!
				}
			},
			include: {
				quiz: {
					select: {
						id: true,
						title: true,
						passingScore: true,
						difficulty: true
					}
				}
			}
		});

		return json(progress);
	} catch (error) {
		console.error('Error fetching quiz results:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
