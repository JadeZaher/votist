import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const PUT: RequestHandler = async ({ params, request }) => {
	try {
		const data = await request.json();

		const quiz = await prisma.quiz.update({
			where: { id: params.id },
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				enabled: data.enabled,
				questions: {
					upsert: data.questions.map((q: any) => ({
						where: { id: q.id },
						create: {
							text: q.text,
							correctAnswer: q.correctAnswer,
							points: q.points,
							options: {
								create: q.options.map((opt: any) => ({
									text: opt.text,
									isCorrect: opt.isCorrect
								}))
							}
						},
						update: {
							text: q.text,
							correctAnswer: q.correctAnswer,
							points: q.points,
							options: {
								upsert: q.options.map((opt: any) => ({
									where: { id: opt.id },
									create: {
										text: opt.text,
										isCorrect: opt.isCorrect
									},
									update: {
										text: opt.text,
										isCorrect: opt.isCorrect
									}
								}))
							}
						}
					}))
				}
			},
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
						correctOptionId: true,
						points: true,
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

		const quiz = await prisma.quiz.update({
			where: { id: params.id },
			data: { enabled: data.enabled },
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
		console.error('Error updating quiz status:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
};
