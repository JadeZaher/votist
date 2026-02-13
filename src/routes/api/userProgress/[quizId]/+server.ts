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

		// Look up internal DB user by Clerk ID
		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id }
		});
		if (!dbUser) {
			return new Response('User not found', { status: 404 });
		}

		// Validate quiz ID
		if (!event.params.quizId) {
			return new Response('Quiz ID is required', { status: 400 });
		}

		// Parse payload
		const body = await event.request.json();
		const { quizScore, isCompleted, completedAt, answers, materialId } = body;

		// Update or create progress
		const updatedProgress = await prisma.userProgress.upsert({
			where: {
				userId_quizId: {
					userId: dbUser.id,
					quizId: event.params.quizId
				}
			},
			update: {
				quizScore,
				isCompleted,
				completedAt,
				answers,
				materialId: materialId || ''
			},
			create: {
				userId: dbUser.id,
				quizId: event.params.quizId,
				quizScore: quizScore || 0,
				isCompleted: isCompleted || false,
				completedAt: completedAt || null,
				answers,
				materialId: materialId || ''
			}
		});

		// Return updated progress
		return json(updatedProgress);
	} catch (error) {
		console.error('Error updating user progress:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
