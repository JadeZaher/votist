import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const quiz = await prisma.quiz.findUnique({
			where: { id: params.id },
			include: {
				questions: {
					include: {
						options: true
					}
				}
			}
		});

		if (!quiz) {
			return new Response('Quiz not found', { status: 404 });
		}

		// Ensure numeric fields are properly typed
		const formattedQuiz = {
			...quiz,
			points: Number(quiz.points),
			passingScore: Number(quiz.passingScore)
		};

		return json(formattedQuiz);
	} catch (error) {
		console.error('Error fetching quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const data = await request.json();

		if (!data.title || !data.description || !data.difficulty || !data.points || data.points < 1) {
			return new Response('Missing required fields or invalid points value', { status: 400 });
		}

		if (data.passingScore < 1 || data.passingScore > data.questions.length) {
			return new Response('Passing score must be between 1 and the total number of questions', {
				status: 400
			});
		}

		await prisma.quiz.update({
			where: { id: params.id },
			data: {
				questions: {
					deleteMany: {}
				}
			}
		});

		const quiz = await prisma.quiz.update({
			where: { id: params.id },
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				points: data.points,
				passingScore: data.passingScore,
				questions: {
					create: data.questions.map((q: any) => ({
						title: q.title,
						description: q.description,
						correctOptionId: null, // Set this after creating options
						options: {
							create: q.options.map((opt: any) => ({
								text: opt.text,
								isCorrect: opt.isCorrect || false,
								isNoOpinion: opt.isNoOpinion || false
							}))
						}
					}))
				}
			},
			include: {
				questions: {
					include: {
						options: true
					}
				}
			}
		});

		// Update correct option IDs after creation
		for (const question of quiz.questions) {
			const correctOption = question.options.find((opt) => opt.isCorrect);
			if (correctOption) {
				await prisma.question.update({
					where: { id: question.id },
					data: { correctOptionId: correctOption.id }
				});
			}
		}

		return json(quiz);
	} catch (error) {
		console.error('Error updating quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params }) => {
	try {
		await prisma.quiz.delete({
			where: { id: params.id }
		});

		return new Response(null, { status: 204 });
	} catch (error) {
		console.error('Error deleting quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ params, request }) => {
	try {
		const data = await request.json();

		const updatedQuiz = await prisma.quiz.update({
			where: { id: params.id },
			data: {
				sequence: data.sequence !== undefined ? data.sequence : undefined,
				enabled: data.enabled !== undefined ? data.enabled : undefined,
				passingScore: data.passingScore !== undefined ? data.passingScore : undefined
			}
		});

		return json(updatedQuiz);
	} catch (error) {
		console.error('Error updating quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
