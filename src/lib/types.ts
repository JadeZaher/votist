// Enums
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

interface Option {
	text: string;
	isCorrect: boolean;
	isNoOpinion: boolean;
}

interface Question extends BaseEntity {
	quizId: string;
	text: string;
	type: string;
	options: Option[];
	correctAnswer: Option | null;
}

interface Quiz extends BaseEntity {
	order: any;
	title: string;
	description: string;
	passingScore: number;
	associatedMaterialId?: string | null;
	questions: Question[];
	difficulty?: 'VOTIST' | 'SCHOLAR' | 'MENTOR';
}

interface UserProgress extends BaseEntity {
	userId: string;
	materialId: string;
	quizId: string;
	quizScore: number;
	isCompleted: boolean;
	completedAt?: Date | null;
	answers?: Record<string, string> | null;
}

export type { BaseEntity, Question, Quiz, UserProgress, Option };
