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

		if (!data.title || !data.description || !data.difficulty) {
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
				enabled: true,
				questions: {
					create: data.questions.map((q: any) => ({
						text: q.text,
						points: q.points || 1,
						options: {
							create: q.options.map((opt: any) => ({
								text: opt.text
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

		return json(quiz);
	} catch (error) {
		console.error('Error creating quiz:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
