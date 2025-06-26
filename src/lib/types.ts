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
	title: string;
	description?: string | null;
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
	questionCount?: number;
}

interface QuizProgress {
	quizId: string;
	userId: string;
	status: QuizStatus;
}

interface QuizWithProgress extends Quiz {
	sequence: number;
	status: QuizStatus;
	prerequisiteId?: string;
	questionCount?: number;
}

interface QuizQuestion {
	title: string;
	description?: string;
	options: {
		text: string;
		isCorrect: boolean;
		isNoOpinion: boolean;
	}[];
	correctOptionId: string | null;
}

export type {
	BaseEntity,
	Option,
	Question,
	Quiz,
	QuizProgress,
	QuizWithProgress,
	QuizDifficulty,
	QuizStatus,
	QuizQuestion
};
