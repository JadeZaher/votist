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
	imageUrl?: string;
	imageAlt?: string;
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

// Poll Feed Types
export interface PollOption {
	id: string;
	text: string;
	votes: number;
}

export interface PostAuthor {
	name: string;
	avatar: string;
	username: string;
	isVerified?: boolean;
}

export interface Poll {
	question: string;
	options: PollOption[];
	totalVotes: number;
	userVote?: string; // option id that user voted for
	endsAt?: string;
}

export interface PostData {
	id: string;
	title: string;
	content: string;
	author: PostAuthor;
	timestamp: string;
	category: string;
	likes: number;
	comments: number;
	isLiked: boolean;
	isBookmarked: boolean;
	tags: string[];
	poll?: Poll;
}

export interface CommentData {
	id: string;
	author: {
		name: string;
		avatar: string;
		username: string;
	};
	content: string;
	timestamp: string;
	likes: number;
	isLiked: boolean;
	replies?: CommentData[];
}

export interface PollFeedData {
	post: PostData;
	comments: CommentData[];
}
