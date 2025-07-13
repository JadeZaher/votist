<script lang="ts">
	import QuizRoadmap from '$lib/components/quiz/QuizRoadmap.svelte';
	import type { QuizWithProgress } from '$lib/types';

	interface PageData {
		quizzes: QuizWithProgress[];
	}

	let { data }: { data: PageData } = $props();
</script>

<div class="bg-base-100 min-h-screen py-8">
	<div class="container mx-auto px-4">
		<QuizRoadmap quizzes={data.quizzes} />
	</div>
</div>
