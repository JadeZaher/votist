import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const quizzes = await prisma.quiz.findMany({
			include: {
				questions: {
					include: {
						options: true
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
						correctAnswer: q.correctAnswer,
						points: q.points,
						options: {
							create: q.options.map((opt: string) => ({
								text: opt
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
