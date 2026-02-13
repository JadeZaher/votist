import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

// GET /api/userProgress - Get all progress for current user
export const GET: RequestHandler = async (event: RequestEvent) => {
	try {
		const { user } = await getUser(event);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id }
		});
		if (!dbUser) {
			return json([]);
		}

		const progress = await prisma.userProgress.findMany({
			where: { userId: dbUser.id }
		});
		return json(progress);
	} catch (error) {
		console.error('Error fetching user progress:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

// PATCH /api/userProgress/:quizId - Update progress for a quiz
export const PATCH: RequestHandler = async (event: RequestEvent) => {
	try {
		const { user } = await getUser(event);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const dbUser = await prisma.user.findUnique({
			where: { clerkId: user.id }
		});
		if (!dbUser) {
			return new Response('User not found', { status: 404 });
		}

		const { quizId, quizScore, isCompleted, completedAt, materialId } = await event.request.json();
		if (!quizId) {
			return new Response('Quiz ID is required', { status: 400 });
		}

		const updated = await prisma.userProgress.upsert({
			where: {
				userId_quizId: {
					userId: dbUser.id,
					quizId
				}
			},
			update: {
				quizScore,
				isCompleted,
				completedAt,
				materialId: materialId || ''
			},
			create: {
				userId: dbUser.id,
				quizId,
				quizScore: quizScore || 0,
				isCompleted: isCompleted || false,
				completedAt: completedAt || null,
				materialId: materialId || ''
			}
		});

		return json(updated);
	} catch (error) {
		console.error('Error updating user progress:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
