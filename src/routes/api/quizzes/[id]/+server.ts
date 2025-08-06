import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { json } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

// GET /api/quizzes/[id] - Get a single quiz by ID
export const GET: RequestHandler = async ({ params, url }) => {
	let id = params?.id ?? url.pathname.split('/').pop();
	if (!id) {
		return json({ error: 'Quiz ID is required' }, { status: 400 });
	}
	try {
		const quiz = await prisma.quiz.findUnique({
			where: { id },
			include: { questions: true }
		});
		if (!quiz) {
			return json({ error: 'Quiz not found' }, { status: 404 });
		}
		const fixedQuiz = {
			...quiz,
			questions: quiz.questions.map((q: any) => ({
				...q,
				options: Array.isArray(q.options)
					? q.options
					: q.options && typeof q.options === 'object' && Object.keys(q.options).length > 0
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
		return json(fixedQuiz);
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};

// PUT /api/quizzes/[id] - Update an existing quiz (admin only)
export const PUT: RequestHandler = async (event) => {
	const { user } = await getUser(event);

	if (user.publicMetadata?.role !== 'admin') {
		return json({ error: 'Forbidden' }, { status: 403 });
	}

	const id = event.url.pathname.split('/').pop();
	if (!id) {
		return json({ error: 'Quiz ID is required' }, { status: 400 });
	}
	const data = await event.request.json();
	try {
		await prisma.quiz.update({
			where: { id: id },
			data: {
				title: data.title,
				description: data.description,
				passingScore: data.passingScore,
				associatedMaterialId: data.associatedMaterialId,
				order: data.order,
				difficulty: data.difficulty
			}
		});

		const existingQuestions = await prisma.question.findMany({ where: { quizId: id } });
		const existingIds = new Set(existingQuestions.map((q) => q.id));
		const incomingIds = new Set(
			(data.questions || []).filter((q: any) => q.id).map((q: any) => q.id)
		);

		const toDelete = [...existingIds].filter((qid) => !incomingIds.has(qid));
		if (toDelete.length > 0) {
			await prisma.question.deleteMany({ where: { id: { in: toDelete } } });
		}

		for (const q of data.questions || []) {
			if (q.id && existingIds.has(q.id)) {
				await prisma.question.update({
					where: { id: q.id },
					data: {
						text: q.text,
						type: q.type,
						options: Array.isArray(q.options) ? q.options : [],
						correctAnswer: q.correctAnswer
					}
				});
			} else {
				await prisma.question.create({
					data: {
						quizId: id,
						text: q.text,
						type: q.type,
						options: Array.isArray(q.options) ? q.options : [],
						correctAnswer: q.correctAnswer
					}
				});
			}
		}

		return json({ success: true });
	} catch (error: unknown) {
		let message = 'Unknown error';
		if (error && typeof error === 'object' && 'message' in error) {
			message = (error as any).message;
		}
		return json({ error: message }, { status: 500 });
	}
};
