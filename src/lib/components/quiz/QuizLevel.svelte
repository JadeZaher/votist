<script lang="ts">
	import QuizListItem from './QuizListItem.svelte';

	export let level;
	export let quizzes;
	export let canTakeQuiz;
	export let takeQuiz;
	export let getQuizStatus;
	export let nextAvailableQuiz;
</script>

<div class="mb-8">
	<div class="mb-4 flex items-center gap-3">
		<div class="avatar" aria-hidden="true">
			<div class="flex h-14 w-14 items-center justify-center rounded-full {level.bgColor}">
				<span
					class="flex h-full w-full items-center justify-center text-2xl font-semibold text-white"
				>
					{level.letter}
				</span>
			</div>
		</div>
		<span class="text-2xl font-bold {level.textColor}">{level.label}</span>
	</div>

	<!-- Quiz List -->
	<div class="ml-16 flex flex-col gap-6">
		{#each quizzes as quiz}
			<QuizListItem
				{quiz}
				{level}
				canTakeQuiz={canTakeQuiz(quiz)}
				onClick={() => takeQuiz(quiz)}
				status={getQuizStatus(quiz)}
				isNext={nextAvailableQuiz && quiz.id === nextAvailableQuiz.id}
			/>
		{/each}
	</div>
</div>
