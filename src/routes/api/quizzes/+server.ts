import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

// Get all quizzes
export const GET: RequestHandler = async (event) => {
	try {
		const { user } = await getUser(event);
		if (!user) {
			return new Response('Unauthorized', { status: 401 });
		}
		const userId = user.id;

		const quizzes = await prisma.quiz.findMany({
			select: {
				id: true,
				title: true,
				description: true,
				difficulty: true,
				points: true,
				passingScore: true,
				enabled: true,
				sequence: true,
				prerequisiteId: true,
				_count: {
					select: {
						questions: true
					}
				}
			},
			orderBy: [{ difficulty: 'asc' }, { sequence: 'asc' }]
		});

		const progress = await prisma.quizProgress.findMany({
			where: { userId },
			select: { quizId: true, status: true }
		});

		const progressMap = progress.reduce(
			(map, item) => {
				map[item.quizId] = item.status;
				return map;
			},
			{} as Record<string, string>
		);

		let previousCompleted = true;
		const formattedQuizzes = quizzes.map((quiz) => {
			const userStatus = progressMap[quiz.id];
			let status = 'LOCKED';

			if (userStatus === 'COMPLETED') {
				status = 'COMPLETED';
				previousCompleted = true;
			} else if (previousCompleted && quiz.enabled) {
				status = 'AVAILABLE';
				previousCompleted = false;
			}

			return {
				id: quiz.id,
				title: quiz.title,
				description: quiz.description,
				difficulty: quiz.difficulty,
				points: quiz.points,
				passingScore: quiz.passingScore,
				enabled: quiz.enabled,
				sequence: quiz.sequence,
				prerequisiteId: quiz.prerequisiteId,
				questionCount: quiz._count.questions,
				status
			};
		});

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

		if (data.passingScore && (data.passingScore < 1 || data.passingScore > data.questions.length)) {
			return new Response('Passing score must be between 1 and the total number of questions', {
				status: 400
			});
		}

		const highestSequenceQuiz = await prisma.quiz.findFirst({
			where: { difficulty: data.difficulty },
			orderBy: { sequence: 'desc' }
		});

		const nextSequence = (highestSequenceQuiz?.sequence || 0) + 1;

		const quiz = await prisma.quiz.create({
			data: {
				title: data.title,
				description: data.description,
				difficulty: data.difficulty,
				points: data.points,
				passingScore: data.passingScore || 1,
				enabled: true,
				sequence: nextSequence,
				prerequisiteId: data.prerequisiteId || null,
				questions: {
					create: data.questions.map((q: any) => ({
						title: q.title || '',
						description: q.description || '',
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
