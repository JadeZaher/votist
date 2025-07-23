// Enums
export enum QuizDifficulty {
	VOTIST = 'VOTIST',
	SCHOLAR = 'SCHOLAR',
	MENTOR = 'MENTOR'
}

export enum QuizStatus {
	LOCKED = 'LOCKED',
	AVAILABLE = 'AVAILABLE',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED'
}

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
	passingScore: number;
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

export type { BaseEntity, Option, Question, Quiz, QuizProgress, QuizWithProgress };
