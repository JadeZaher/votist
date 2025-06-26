<script lang="ts">
	import { onMount } from 'svelte';
	import { goToPage } from '../../../stores/quizStore';
	import QuizRoadmap from './QuizRoadmap.svelte';
	import type { QuizWithProgress } from '$lib/types';

	let quizzes: QuizWithProgress[] = [];
	let loading = true;

	async function fetchQuizzes() {
		try {
			const response = await fetch('/api/quizzes');
			if (!response.ok) {
				throw new Error('Failed to fetch quizzes');
			}
			quizzes = await response.json();
		} catch (error) {
			console.error('Error fetching quizzes:', error);
		} finally {
			loading = false;
		}
	}

	onMount(fetchQuizzes);

	let canStart = quizzes.some((quiz) => quiz.status === 'AVAILABLE');

	const startQuiz = () => {
		const firstAvailableQuiz = quizzes.find((quiz) => quiz.status === 'AVAILABLE');
		if (firstAvailableQuiz) {
			goToPage(`/quiz/${firstAvailableQuiz.id}`);
		}
	};
</script>

<div class="mx-auto max-w-[1168px]">
	{#if loading}
		<!-- Loading Spinner -->
		<div class="flex h-64 items-center justify-center">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	{:else if quizzes.length === 0}
		<!-- No Quizzes Available -->
		<div class="text-center">
			<div class="alert alert-info shadow-lg">
								<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-6 w-6 shrink-0 stroke-current"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>No quizzes are currently available.</span>
			</div>
		</div>
	{:else}
		<!-- Info Section -->
		<div class="mb-16 space-y-8">
			<div class="flex items-start gap-6">
				<span class="text-primary font-['Roboto'] text-5xl leading-[61px] font-black">1</span>
				<p class="text-base-content font-['Roboto'] text-2xl leading-loose font-normal">
					Votist requires a short quiz before voting to ensure every voice is informed.
				</p>
			</div>

			<div class="flex items-start gap-6">
				<span class="text-primary font-['Roboto'] text-5xl leading-[61px] font-black">2</span>
				<p class="text-base-content font-['Roboto'] text-2xl leading-loose font-normal">
					Each quiz you pass increases the power of your vote.
				</p>
			</div>

			<button class="btn btn-primary btn-lg" on:click={startQuiz} disabled={!canStart}>
				Start
			</button>
		</div>

		<!-- Roadmap Section -->
		<div class="divider"></div>
		<QuizRoadmap {quizzes} />
	{/if}
</div>
