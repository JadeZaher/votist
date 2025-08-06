import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

// GET /api/quizzes - Get all quizzes
export const GET: RequestHandler = async () => {
	try {
		const quizzes = await prisma.quiz.findMany({
			include: { questions: true },
			orderBy: { order: 'asc' }
		});
		return json(quizzes);
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};

// POST /api/quizzes - Create a new quiz (admin only)
export const POST: RequestHandler = async (event) => {
	const { user } = await getUser(event);

	if (user.publicMetadata?.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const data = await event.request.json();
	try {
		const quiz = await prisma.quiz.create({
			data: {
				title: data.title,
				description: data.description,
				passingScore: data.passingScore,
				associatedMaterialId: data.associatedMaterialId,
				questions: {
					create: (data.questions as any[]).map((q: any) => ({
						text: q.text,
						type: q.type,
						options: q.options,
						correctAnswer: q.correctAnswer
					}))
				},
				difficulty: data.difficulty || 'VOTIST'
			},
			include: { questions: true }
		});
		return json({ quiz });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 400 });
	}
};
