import type { QuizDifficulty, QuizStatus } from '@prisma/client';

// Base types
interface BaseEntity {
	id: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface Option extends BaseEntity {
	text: string;
	questionId?: string;
	isNoOpinion?: boolean;
	isCorrect?: boolean;
}

interface Question extends BaseEntity {
	text: string;
	points: number;
	correctOptionId: string | null;
	quizId: string;
	options: Option[];
}

interface Quiz extends BaseEntity {
	title: string;
	description: string;
	difficulty: QuizDifficulty;
	enabled: boolean;
	questions: Question[];
	sequence: number;
	prerequisiteId?: string;
}

interface QuizProgress {
	quizId: string;
	userId: string;
	status: QuizStatus;
}

interface QuizWithProgress extends Quiz {
	status: QuizStatus;
}

export type {
	BaseEntity,
	Option,
	Question,
	Quiz,
	QuizProgress,
	QuizWithProgress,
	QuizDifficulty,
	QuizStatus
};
