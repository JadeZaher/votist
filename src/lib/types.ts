import { QuizDifficulty as PrismaQuizDifficulty } from '@prisma/client';

// Re-export the Prisma enum instead of creating our own
export { PrismaQuizDifficulty as QuizDifficulty };

export interface Option {
	id: string;
	text: string;
	questionId?: string;
	createdAt?: Date; 
	updatedAt?: Date; 
	isCorrect?: boolean; 
}

export interface Question {
	id: string;
	text: string;
	points: number;
	correctOptionId: string | null;
	quizId: string;
	options: Option[];
	createdAt?: Date; 
	updatedAt?: Date; 
}

export interface Quiz {
	id: string;
	title: string;
	description: string;
	difficulty: string;
	enabled: boolean;
	questions: Question[];
	createdAt?: Date;
	updatedAt?: Date;
}
