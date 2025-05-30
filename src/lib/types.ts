import type { Prisma } from '@prisma/client';

export enum QuizDifficulty {
	VOTIST = 'VOTIST',
	SCHOLAR = 'SCHOLAR',
	MENTOR = 'MENTOR'
}

export type Quiz = {
	id: string;
	title: string;
	description: string;
	difficulty: QuizDifficulty;
	enabled: boolean;
	createdAt: Date;
	updatedAt: Date;
	questions?: Question[];
};

export type Question = {
	id: string;
	text: string;
	options: Option[];
};

export type Option = {
	id: string;
	text: string;
	isCorrect: boolean;
};
