<script lang="ts">
	import { onMount } from 'svelte';
	import type { Quiz } from '$lib/types';
	import QuizForm from './components/QuizForm.svelte';
	import QuizList from './components/QuizList.svelte';

	let showForm = false;
	let quizzes: Quiz[] = [];
	let loading = true;

	onMount(async () => {
		const response = await fetch('/api/quizzes');
		quizzes = await response.json();
		loading = false;
	});
</script>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-3xl font-bold">Quiz Management</h1>
	<button class="btn btn-primary" on:click={() => (showForm = !showForm)}>
		{showForm ? 'Show Quiz List' : 'Create New Quiz'}
	</button>
</div>

<div class="divider"></div>

{#if loading}
	<div class="flex justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if showForm}
	<QuizForm
		on:saved={() => {
			showForm = false;
			window.location.reload();
		}}
	/>
{:else}
	<QuizList {quizzes} />
{/if}
