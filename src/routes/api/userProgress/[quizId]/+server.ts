import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

export const PATCH: RequestHandler = async (event: RequestEvent) => {
	try {
		// Authenticate user
		const { user } = await getUser(event);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}
		const userId = user.id;

		// Validate quiz ID
		if (!event.params.quizId) {
			return new Response('Quiz ID is required', { status: 400 });
		}

		// Parse and validate status
		const { status } = await event.request.json();
		const validStatuses = ['LOCKED', 'AVAILABLE', 'IN_PROGRESS', 'COMPLETED'];
		if (!validStatuses.includes(status)) {
			return new Response('Invalid status', { status: 400 });
		}

		// Update or create progress
		const updatedProgress = await prisma.quizProgress.upsert({
			where: {
				userId_quizId: {
					userId,
					quizId: event.params.quizId
				}
			},
			update: { status },
			create: {
				userId,
				quizId: event.params.quizId,
				status
			}
		});

		// Return updated progress
		return json(updatedProgress);
	} catch (error) {
		console.error('Error updating user progress:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
