import { writable } from 'svelte/store';
import sanRafaelVideo from '$lib/assets/1.mp4';

// Types
export type QuizQuestion = {
	id: number;
	question: string;
	options: string[];
	correctAnswer: string;
	video: string;
};

export type QuizLevel = {
	id: number;
	number: number;
	title: string;
	status: 'completed' | 'current' | 'upcoming';
};

export type UserStatus = {
	votes: number;
	knowledge: number;
	status: string;
};

// Initial Data
const initialQuestions: QuizQuestion[] = [
	{
		id: 1,
		question: 'What city is this?',
		options: ['San Rafael', 'Larkspur', 'Novato'],
		correctAnswer: 'San Rafael',
		video: sanRafaelVideo
	},
	{
		id: 2,
		question: 'San Rafael is in which County?',
		options: ['Alameda', 'Sonoma', 'Marin'],
		correctAnswer: 'Marin',
		video: sanRafaelVideo
	},
	{
		id: 3,
		question: 'What is this location?',
		options: ['Northgate', 'Mission San Rafael', 'Brete Harte'],
		correctAnswer: 'Mission San Rafael',
		video: sanRafaelVideo
	}
];

export const initialLevels: QuizLevel[] = [
	{ id: 1, number: 1, title: 'San Rafael Location', status: 'current' },
	{
		id: 2,
		number: 2,
		title: 'San Rafael History, Demographics & Civic Basics',
		status: 'upcoming'
	},
	{ id: 3, number: 3, title: 'Who Cares?', status: 'upcoming' },
	{ id: 4, number: 4, title: 'Planning Process', status: 'upcoming' },
	{ id: 5, number: 5, title: 'Development Codes & Legal Requirements', status: 'upcoming' },
	{
		id: 6,
		number: 6,
		title: 'Cities, State Mandates, and What We Can Still Control',
		status: 'upcoming'
	},
	{ id: 7, number: 7, title: 'California Housing & Development Laws Quiz', status: 'upcoming' },
	{ id: 8, number: 8, title: 'Housing Affordability & Economic Impact', status: 'upcoming' },
	{ id: 9, number: 9, title: 'Infrastructure & City Services Quiz', status: 'upcoming' },
	{ id: 10, number: 10, title: 'Advanced Scenarios', status: 'upcoming' }
];

// Quiz State
export const currentPage = writable('start'); // 'start', 'question', 'feedback', 'completed', 'tryAgain'
export const questions = writable(initialQuestions);
export const currentQuestionIndex = writable(0);
export const selectedAnswer = writable<string | null>(null);
export const isAnswerCorrect = writable(false);
export const correctAnswersCount = writable(0);
export const quizCompleted = writable(false);
export const currentLevel = writable(initialLevels[0]);
export const levels = writable(initialLevels);
export const userStatus = writable<UserStatus>({
	votes: 1,
	knowledge: 1,
	status: 'Votist'
});

// Quiz Actions
export const resetQuiz = () => {
	currentQuestionIndex.set(0);
	selectedAnswer.set(null);
	isAnswerCorrect.set(false);
	correctAnswersCount.set(0);
	quizCompleted.set(false);
	currentPage.set('start');
};

export const goToPage = (page: string) => {
	currentPage.set(page);
};

export const selectAnswer = (answer: string) => {
	selectedAnswer.set(answer);
};

export const checkAnswer = () => {
	let correct = false;

	questions.update((questions) => {
		const currentQuestion = questions[$currentQuestionIndex];
		correct = currentQuestion.correctAnswer === $selectedAnswer;
		return questions;
	});

	isAnswerCorrect.set(correct);

	if (correct) {
		correctAnswersCount.update((count) => count + 1);
	}

	currentPage.set('feedback');
	return correct;
};

export const nextQuestion = () => {
	selectedAnswer.set(null);

	currentQuestionIndex.update((index) => {
		if (index < $questions.length - 1) {
			index++;
			currentPage.set('question');
			return index;
		} else {
			quizCompleted.set(true);
			currentPage.set('completed');
			return index;
		}
	});
};

export const skipQuestion = () => {
	selectedAnswer.set(null);

	currentQuestionIndex.update((index) => {
		if (index < $questions.length - 1) {
			index++;
			currentPage.set('question');
			return index;
		} else {
			quizCompleted.set(true);
			currentPage.set('completed');
			return index;
		}
	});
};

let $currentQuestionIndex: number;
let $selectedAnswer: string | null;
let $questions: QuizQuestion[];

currentQuestionIndex.subscribe((value) => {
	$currentQuestionIndex = value;
});

selectedAnswer.subscribe((value) => {
	$selectedAnswer = value;
});

questions.subscribe((value) => {
	$questions = value;
});
