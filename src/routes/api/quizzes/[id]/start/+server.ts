import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';

export const POST: RequestHandler = async ({ params, locals }) => {
	if (!params.id) {
		throw error(400, 'Quiz ID is required');
	}

	try {
		// Get authenticated user data
		const { user } = await getUser({ locals } as any);
		const userId = user.id;

		// Check if quiz exists and is enabled
		const quiz = await prisma.quiz.findUnique({
			where: { id: params.id },
			include: {
				prerequisite: true
			}
		});

		if (!quiz || !quiz.enabled) {
			throw error(404, 'Quiz not found or disabled');
		}

		// Check prerequisites if they exist
		if (quiz.prerequisiteId) {
			const prerequisiteProgress = await prisma.quizProgress.findUnique({
				where: {
					userId_quizId: {
						userId,
						quizId: quiz.prerequisiteId
					}
				}
			});

			if (!prerequisiteProgress?.status || prerequisiteProgress.status !== 'COMPLETED') {
				throw error(403, 'Prerequisites not met');
			}
		}

		// Create or update quiz progress
		const progress = await prisma.quizProgress.upsert({
			where: {
				userId_quizId: {
					userId,
					quizId: params.id
				}
			},
			update: {
				status: 'IN_PROGRESS'
			},
			create: {
				userId,
				quizId: params.id,
				status: 'IN_PROGRESS'
			}
		});

		return json({
			success: true,
			progress
		});
	} catch (err) {
		console.error('Error starting quiz:', err);
		throw error(500, 'Failed to start quiz');
	}
};
