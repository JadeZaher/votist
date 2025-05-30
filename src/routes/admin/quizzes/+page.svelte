<script lang="ts">
	import { onMount } from 'svelte';
	import type { Quiz } from '$lib/types';

	let quizzes: Quiz[] = [];
	let loading = true;

	onMount(async () => {
		const response = await fetch('/api/quizzes');
		quizzes = await response.json();
		loading = false;
	});
</script>

{#if loading}
	<div class="flex justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else}
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Title</th>
					<th>Difficulty</th>
					<th>Questions</th>
					<th>Status</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each quizzes as quiz}
					<tr>
						<td>{quiz.title}</td>
						<td>
							<div class="badge" data-difficulty={quiz.difficulty.toLowerCase()}>
								{quiz.difficulty}
							</div>
						</td>
						<td>{quiz.questions?.length || 0} questions</td>
						<td>
							<div class="badge badge-outline">
								{quiz.enabled ? 'Active' : 'Disabled'}
							</div>
						</td>
						<td>
							<div class="flex gap-2">
								<button class="btn btn-sm">Edit</button>
								<button class="btn btn-sm btn-error">Delete</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}
