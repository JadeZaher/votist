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
				questions: {
					select: {
						id: true,
						text: true,
						_count: {
							select: {
								options: true
							}
						},
						options: {
							select: {
								id: true,
								text: true
							}
						}
					}
				}
			}
		});

		return json(quizzes);
	} catch (error) {
		console.error('Error fetching quizzes:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};

// Create a new quiz
export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json();

		// Validate required fields
		if (!data.title || !data.description || !data.difficulty || !data.points) {
			return new Response('Missing required fields', { status: 400 });
		}

		if (!Array.isArray(data.questions) || data.questions.length === 0) {
			return new Response('At least one question is required', { status: 400 });
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
						text: q.text,
						correctOptionId: q.correctOptionId,
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
						options: {
							select: {
								id: true,
								text: true,
								isCorrect: true,
								isNoOpinion: true
							}
						}
					}
				}
			}
		});

		return json(quiz);
	} catch (error) {
		console.error('Error creating quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
