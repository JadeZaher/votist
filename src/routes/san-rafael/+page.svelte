<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import QuizRoadmap from '$lib/components/quiz/QuizRoadmap.svelte';

	let quizzes: any[] = [];
	let loading = true;
	let error: string | null = null;

	let grouped: Record<string, any[]> = {};

	let completedQuizIds: string[] = [];
	let userProgress: Record<string, any> = {};

	onMount(async () => {
		try {
			const res = await fetch('/api/quizzes');
			const data = await res.json();
			if (data.error) {
				error = data.error;
			} else {
				quizzes = data;
				grouped = {
					VOTIST: quizzes.filter((q) => q.difficulty === 'VOTIST'),
					SCHOLAR: quizzes.filter((q) => q.difficulty === 'SCHOLAR'),
					MENTOR: quizzes.filter((q) => q.difficulty === 'MENTOR')
				};
				// Fetch user progress for all quizzes
				const progressRes = await fetch('/api/userProgress');
				const progressData = await progressRes.json();
				userProgress = progressData.reduce((acc: any, p: any) => {
					acc[p.quizId] = p;
					return acc;
				}, {});
				completedQuizIds = quizzes
					.filter((q) => {
						const progress = userProgress[q.id];
						return progress && progress.isCompleted && progress.quizScore >= q.passingScore;
					})
					.map((q) => q.id);
			}
		} catch (e) {
			error = 'Failed to load quizzes';
		} finally {
			loading = false;
		}
	});

	function openQuiz(id: string) {
		goto(`/san-rafael/quiz/${id}`);
	}

	function nextAvailableQuiz() {
		const difficultyOrder = ['VOTIST', 'SCHOLAR', 'MENTOR'];
		const allQuizIds = quizzes
			.sort((a, b) => {
				const diffA = difficultyOrder.indexOf(a.difficulty);
				const diffB = difficultyOrder.indexOf(b.difficulty);
				if (diffA !== diffB) return diffA - diffB;
				return (a.order ?? 0) - (b.order ?? 0);
			})
			.map((q) => q.id);
		// Only unlock next quiz if previous is completed
		for (let i = 0; i < allQuizIds.length; i++) {
			if (!completedQuizIds.includes(allQuizIds[i])) {
				// Check if all previous quizzes are completed
				const allPrevCompleted = allQuizIds
					.slice(0, i)
					.every((id) => completedQuizIds.includes(id));
				if (allPrevCompleted) {
					openQuiz(allQuizIds[i]);
					return;
				}
			}
		}
	}

	$: totalQuizzes = quizzes.length;
</script>

<div class="bg-base-100 flex min-h-screen flex-col items-center px-4 py-8 md:px-6 md:py-12">
	<!-- Header -->
	<div class="mx-auto mb-6 w-full max-w-4xl md:mb-8">
		<div class="flex flex-col items-start gap-2">
			<div class="flex items-center gap-3 md:gap-4">
				<span class="badge badge-primary badge-md md:badge-lg">Level 01</span>
				<span class="text-xl font-semibold text-cyan-700 md:text-3xl">San Rafael, Location</span>
			</div>
			<div class="mt-2 text-base leading-relaxed font-normal text-stone-900 md:text-2xl md:leading-loose">
				Votist requires a short quiz before voting to ensure every voice is informed.
			</div>
			<div class="text-base leading-relaxed font-normal text-stone-900 md:text-2xl md:leading-loose">
				Each quiz you pass increases the power of your vote.
			</div>
			<div class="mt-4">
				<button
					type="button"
					class="btn btn-primary btn-md px-8 text-lg md:btn-lg md:px-10 md:text-2xl"
					onclick={nextAvailableQuiz}
					aria-label="Start next available quiz"
				>
					Start
				</button>
			</div>
		</div>
	</div>

	<!-- Quiz Roadmap Title and Count -->
	<div class="mx-auto mb-6 w-full max-w-4xl md:mb-8">
		<h2 class="mb-2 text-xl font-bold text-cyan-700 md:text-3xl">Housing Assembly Quiz Roadmap</h2>
		<div class="flex items-center gap-2">
			<svg
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="text-stone-900"
			>
				<g clip-path="url(#clip0_2625_383)">
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M5 14.5H0V0.5H5.72727L8 1.58025L10.2727 0.5H16V14.5H11V15.5H9H8.63636H7.36364H7H5V14.5ZM9 13.1745V3.31936L10.7239 2.5H14V8.5H10V12.7514L9 13.1745ZM5.27615 2.5L7 3.31936V13.1745L5.40567 12.5H2V2.5H5.27615ZM12 12.5V10.5H14L12 12.5Z"
						fill="currentColor"
					/>
				</g>
				<defs>
					<clipPath id="clip0_2625_383">
						<rect width="16" height="15" fill="white" transform="translate(0 0.5)" />
					</clipPath>
				</defs>
			</svg>
			<span class="font-normal text-stone-900">{totalQuizzes} quizzes</span>
		</div>
	</div>

	{#if loading}
		<div class="flex h-32 items-center justify-center" role="status" aria-live="polite">
			<span class="loading loading-spinner loading-lg" aria-label="Loading"></span>
		</div>
	{:else if error}
		<div class="alert alert-error" role="alert">{error}</div>
	{:else}
		<QuizRoadmap {quizzes} {completedQuizIds} {userProgress} />
	{/if}
</div>
