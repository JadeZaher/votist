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
				enabled: true,
				questions: {
					select: {
						id: true,
						text: true,
						points: true,
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

		const quiz = await prisma.quiz.create({
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				enabled: true,
				questions: {
					create: data.questions.map((q: any) => ({
						text: q.text,
						points: q.points,
						options: {
							create: q.options.map((opt: any) => ({
								text: opt.text
							}))
						},
						correctOptionId: q.correctOptionId
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

		return json(quiz);
	} catch (error) {
		console.error('Error creating quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
