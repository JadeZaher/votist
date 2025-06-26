<script lang="ts">
	import type { QuizDifficulty } from '$lib/types';
	import type { QuizStatus } from '@prisma/client';

	interface QuizLevel {
		id: QuizDifficulty;
		label: string;
		letter: string;
		color: string;
	}

	interface QuizWithProgress {
		id: string;
		title: string;
		difficulty: QuizDifficulty;
		sequence: number;
		status: QuizStatus;
		prerequisiteId?: string;
	}

	const levels: QuizLevel[] = [
		{ id: 'VOTIST', label: 'Votist', letter: 'V', color: 'bg-primary' },
		{ id: 'SCHOLAR', label: 'Scholar', letter: 'S', color: 'bg-secondary' },
		{ id: 'MENTOR', label: 'Mentor', letter: 'M', color: 'bg-accent' }
	];

	export let quizzes: QuizWithProgress[] = [];

	function getQuizStatusClass(quiz: QuizWithProgress): string {
		switch (quiz.status) {
			case 'AVAILABLE':
				return 'bg-success';
			case 'COMPLETED':
				return 'bg-primary';
			case 'IN_PROGRESS':
				return 'bg-warning';
			default:
				return 'bg-base-300';
		}
	}

	let availableQuizzes = quizzes.filter((quiz) => {
		if (!quiz.prerequisiteId) return true; // No prerequisite
		const prerequisite = quizzes.find((q) => q.id === quiz.prerequisiteId);
		return prerequisite?.status === 'COMPLETED';
	});

	let sortedQuizzes = availableQuizzes.sort((a, b) => a.sequence - b.sequence);

	let nextQuiz = sortedQuizzes.find((quiz) => quiz.status === 'AVAILABLE');
</script>

<div class="relative w-[1168px] overflow-hidden">
	<!-- Level and Title Section -->
	<div
		class="absolute top-[81px] left-[121px] inline-flex items-center justify-center gap-4 rounded px-4 py-2"
	>
		<div class="text-center font-['Roboto'] text-xl font-bold text-cyan-800">Level 01</div>
	</div>
	<div
		class="absolute top-[136px] left-[131px] h-14 w-[861px] font-['Roboto'] text-3xl font-semibold text-cyan-700"
	>
		San Rafael, Location
	</div>

	<!-- Quiz Roadmap Title -->
	<div
		class="absolute top-[538px] left-[137px] font-['Roboto'] text-3xl leading-[48.24px] font-bold text-cyan-700"
	>
		Housing Assembly Quiz Roadmap
	</div>

	<!-- Quiz Info -->
	<div class="absolute top-[616px] left-[147px] inline-flex items-center gap-4">
		<!-- Book Icon -->
		<div class="flex items-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-6 w-6 text-black"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 4v16m8-16v16m-8-8h8m-8 0H4"
				/>
			</svg>
		</div>
		<!-- Number of Quizzes -->
		<div class="font-['Arial'] text-base leading-7 font-normal text-stone-900">
			{quizzes.length} Quizzes
		</div>
	</div>

	<!-- Levels -->
	{#each levels as level, i}
		<div class="absolute" style="top: {681 + i * 383}px; left: 147px;">
			<div class="h-14 w-14 {level.color} flex items-center justify-center rounded-full">
				<span class="font-['Roboto'] text-2xl font-semibold text-white">{level.letter}</span>
			</div>
			<div
				class="absolute top-[12px] left-[84px] font-['Arial'] text-2xl leading-loose font-bold"
				class:text-primary={level.id === 'VOTIST'}
				class:text-secondary={level.id === 'SCHOLAR'}
				class:text-accent={level.id === 'MENTOR'}
			>
				{level.label}
			</div>
		</div>
	{/each}

	<!-- Quizzes -->
	{#each sortedQuizzes as quiz, index}
		<div class="absolute" style="top: {818 + index * 77}px; left: 238px;">
			<div
				class="h-14 w-14 {getQuizStatusClass(
					quiz
				)} rounded-[10px} flex items-center justify-center {quiz.id === nextQuiz?.id
					? 'border-primary border-4'
					: ''}"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</div>
			<div
				class="text-base-content absolute top-[12px] left-[79px] font-['Roboto'] text-base leading-relaxed font-normal"
			>
				{quiz.title}
			</div>
		</div>
	{/each}
</div>
