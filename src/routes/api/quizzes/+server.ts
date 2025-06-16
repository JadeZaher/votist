import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';

// Get all quizzes
export const GET: RequestHandler = async () => {
	try {
		const quizzes = await prisma.quiz.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				difficulty: true,
				points: true,
				enabled: true,
				_count: {
					select: {
						questions: true
					}
				}
			}
		});

		const formattedQuizzes = quizzes.map((quiz) => ({
			id: quiz.id,
			title: quiz.title,
			description: quiz.description,
			difficulty: quiz.difficulty,
			points: quiz.points,
			enabled: quiz.enabled,
			questionCount: quiz._count.questions
		}));

		return json(formattedQuizzes);
	} catch (error) {
		console.error('Error fetching quizzes:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

// Create a new quiz
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		if (!data.title || !data.description || !data.difficulty || !data.points || data.points < 1) {
			return new Response('Missing required fields or invalid points value', { status: 400 });
		}

		const invalidQuestions = data.questions.filter(
			(q: any) => !q.options.some((opt: any) => opt.isCorrect)
		);

		if (invalidQuestions.length > 0) {
			return new Response('Each question must have one correct answer selected', {
				status: 400
			});
		}

		const quiz = await prisma.quiz.create({
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				points: data.points,
				enabled: true,
				questions: {
					create: data.questions.map((q: any) => ({
						title: q.title || '',
						description: q.description || '',
						correctOptionId: null,
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
		console.error('Error creating quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
