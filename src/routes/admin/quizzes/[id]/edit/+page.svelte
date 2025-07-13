<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import QuizEdit from '../../components/QuizEdit.svelte';
	import type { Quiz } from '$lib/types';

	let quiz: Quiz | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const response = await fetch(`/api/quizzes/${$page.params.id}`);

			if (response.ok) {
				quiz = await response.json();
			} else {
				error = 'Failed to load quiz';
				console.error('Failed to load quiz');
			}
		} catch (err) {
			error = 'An error occurred while loading the quiz';
			console.error('Error loading quiz:', err);
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="flex min-h-screen items-center justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if error}
	<div class="alert alert-error">
		<span>{error}</span>
	</div>
{:else if quiz}
	<QuizEdit {quiz} />
{:else}
	<div class="alert alert-warning">
		<span>Quiz not found</span>
	</div>
{/if}
