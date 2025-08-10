import { error, redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';
import { getUser } from '$lib/server/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { user } = await getUser(event);
	if (!user) {
		throw redirect(302, '/sign-in');
	}

	const quizId = event.params.id;
	if (!quizId) {
		throw error(404, 'Quiz not found');
	}

	const quiz = await prisma.quiz.findUnique({
		where: { id: quizId },
		select: {
			id: true,
			title: true,
			description: true,
			difficulty: true,
			sequence: true,
			points: true,
			passingScore: true,
			questions: {
				select: {
					id: true
				}
			}
		}
	});

	if (!quiz) {
		throw error(404, 'Quiz not found');
	}

	const completion = await prisma.quizCompletion.findUnique({
		where: {
			userId_quizId: {
				userId: user.id,
				quizId: quizId
			}
		}
	});

	if (!completion) {
		throw redirect(302, `/quiz/${quizId}`);
	}

	// Get next available quiz
	const nextQuiz = await prisma.quiz.findFirst({
		where: {
			difficulty: quiz.difficulty,
			sequence: {
				gt: quiz.sequence
			},
			enabled: true,
			QuizProgress: {
				some: {
					userId: user.id,
					status: 'AVAILABLE'
				}
			}
		},
		orderBy: {
			sequence: 'asc'
		},
		select: {
			id: true,
			title: true,
			difficulty: true
		}
	});

	// Calculate user's total points from completed quizzes
	const completedQuizzes = await prisma.quizCompletion.findMany({
		where: {
			userId: user.id,
			completed: true,
			score: {
				gte: 70 // Assuming passing score is generally 70%
			}
		},
		include: {
			quiz: {
				select: {
					points: true,
					difficulty: true
				}
			}
		}
	});

	const totalPoints = completedQuizzes.reduce((sum, completion) => sum + completion.quiz.points, 0);
	const votingPower = completedQuizzes.filter((c) => c.quiz.difficulty === 'VOTIST').length;
	const knowledgePoints = completedQuizzes.length;

	return {
		quiz,
		completion: {
			score: completion.score,
			completed: completion.completed,
			completedAt: completion.completedAt,
			answers: completion.answers
		},
		nextQuiz,
		userStats: {
			totalPoints,
			votingPower,
			knowledgePoints
		}
	};
};
