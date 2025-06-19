import type { QuizDifficulty, QuizStatus } from '@prisma/client';

// Base types
interface BaseEntity {
	id: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface Option extends BaseEntity {
	text: string;
	isCorrect: boolean;
	isNoOpinion: boolean;
	questionId?: string;
}

interface Question extends BaseEntity {
	text: string;
	correctOptionId?: string;
	quizId: string;
	options: Option[];
}

interface Quiz extends BaseEntity {
	title: string;
	description: string;
	difficulty: QuizDifficulty;
	enabled: boolean;
	points: number;
	questions: Question[];
	prerequisiteId?: string | null;
	sequence: number;
}

interface QuizProgress {
	quizId: string;
	userId: string;
	status: QuizStatus;
}

interface QuizWithProgress extends Quiz {
	status: QuizStatus;
	prerequisiteId?: string | undefined;
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
