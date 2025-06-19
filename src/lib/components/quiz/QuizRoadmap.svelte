<script lang="ts">
	import { onMount } from 'svelte';
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
		{ id: 'VOTIST', label: 'Votist', letter: 'V', color: 'bg-votist' },
		{ id: 'SCHOLAR', label: 'Scholar', letter: 'S', color: 'bg-cyan-800' },
		{ id: 'MENTOR', label: 'Mentor', letter: 'M', color: 'bg-amber-400' }
	];

	export let quizzes: QuizWithProgress[] = [];
	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			const response = await fetch('/api/quiz-progress');
			if (!response.ok) throw new Error('Failed to fetch quiz progress');
			quizzes = await response.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'An unknown error occurred';
		} finally {
			loading = false;
		}
	});

	$: sortedQuizzes = quizzes.sort((a, b) => a.sequence - b.sequence);
	$: quizzesByDifficulty = sortedQuizzes.reduce(
		(acc, quiz) => {
			if (quiz.status !== 'LOCKED') {
				acc[quiz.difficulty] = [...(acc[quiz.difficulty] || []), quiz];
			}
			return acc;
		},
		{} as Record<QuizDifficulty, QuizWithProgress[]>
	);
</script>

<div class="relative w-[1168px] overflow-hidden p-8 font-['Roboto']">
	<h2 class="mb-8 text-3xl font-bold text-cyan-700">Housing Assembly Quiz Roadmap</h2>

	<div class="mb-8 flex items-center gap-4">
		<div class="flex h-4 w-4 items-center justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
		</div>
		<span class="text-base leading-7 font-normal text-stone-900">{quizzes.length} Quizzes</span>
	</div>

	<!-- Loading and error states -->
	{#if loading}
		<div class="flex justify-center p-8">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if error}
		<div class="alert alert-error">
			<span>{error}</span>
		</div>
	{:else}
		<div class="mt-8 text-center">
			<p class="text-lg text-gray-600">Explore the quizzes to enhance your voting power!</p>
		</div>
	{/if}

	<!-- Level Progress -->
	<div class="space-y-12">
		{#each levels as level}
			<div class="space-y-6">
				<div class="flex items-center gap-4">
					<div
						class="relative h-14 w-14 rounded-full {level.color} flex items-center justify-center"
					>
						<span class="text-2xl font-semibold text-white">{level.letter}</span>
					</div>
					<span
						class="text-2xl font-bold"
						class:text-slate-500={level.id === 'VOTIST'}
						class:text-cyan-800={level.id === 'SCHOLAR'}
						class:text-amber-400={level.id === 'MENTOR'}
					>
						{level.label}
					</span>
				</div>

				{#if quizzesByDifficulty[level.id]}
					<div class="ml-[91px] space-y-5">
						{#each quizzesByDifficulty[level.id] as quiz}
							<div class="flex items-center gap-4">
								<div
									class="flex h-14 w-14 items-center justify-center rounded-[10px] {quiz.status ===
									'AVAILABLE'
										? 'bg-votist'
										: 'bg-stone-300'}"
								>
									{#if quiz.status === 'LOCKED'}
										<!-- Lock Icon -->
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-6 w-6 text-zinc-500"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
											/>
										</svg>
									{:else if quiz.status === 'AVAILABLE'}
										<!-- Available/Start Icon -->
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
												d="M9 5l7 7-7 7"
											/>
										</svg>
									{/if}
								</div>
								<span class="text-base leading-relaxed font-normal text-black">
									{quiz.title}
								</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
