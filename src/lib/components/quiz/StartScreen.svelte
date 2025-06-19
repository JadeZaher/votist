<script lang="ts">
	import { goToPage } from '../../../stores/quizStore';
	import QuizRoadmap from './QuizRoadmap.svelte';
	import type { Quiz, QuizProgress, QuizWithProgress, Question, Option } from '$lib/types';

	export let quizzes: QuizWithProgress[] = [];
	let canStart = false;

	const startQuiz = () => {
		goToPage('question');
	};
</script>

<div class="card bg-base-100 mx-auto max-w-[1168px] p-8 shadow-lg">
	{#if quizzes.length === 0}
		<div class="card-body text-center">
			<div class="alert alert-info shadow-lg">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="h-6 w-6 shrink-0 stroke-current"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path></svg
				>
				<span>No quizzes are currently available.</span>
			</div>
		</div>
	{:else}
		<div class="card-body">
			<!-- Info Section -->
			<div class="mt-8 space-y-8">
				<div class="flex items-start gap-6">
					<span class="text-primary text-5xl leading-[61px] font-black">1</span>
					<p class="text-2xl leading-loose">
						Votist requires a short quiz before voting to ensure every voice is informed.
					</p>
				</div>

				<div class="flex items-start gap-6">
					<span class="text-primary text-5xl leading-[61px] font-black">2</span>
					<p class="text-2xl leading-loose">Each quiz you pass increases the power of your vote.</p>
				</div>

				<button
					class="btn btn-primary btn-lg text-2xl normal-case"
					on:click={startQuiz}
					disabled={!canStart}
				>
					{!canStart ? 'Locked' : 'Start'}
				</button>
			</div>
		</div>

		<!-- Roadmap Section -->
		<div class="divider"></div>
		<QuizRoadmap {quizzes} />
	{/if}
</div>
