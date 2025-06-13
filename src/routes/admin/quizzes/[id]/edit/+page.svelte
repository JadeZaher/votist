<script lang="ts">
	import type { PageData } from './$types';
	import type { Quiz } from '$lib/types';
	import QuizEdit from '../../components/QuizEdit.svelte';

	export let data: PageData;

	$: transformedQuiz = data.quiz
		? {
				...(data.quiz as Quiz),
				prerequisiteId: (data.quiz as Quiz).prerequisiteId ?? undefined
			}
		: null;
</script>

{#if !transformedQuiz}
	<div class="flex justify-center p-4">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else}
	<QuizEdit quiz={transformedQuiz} />
{/if}
