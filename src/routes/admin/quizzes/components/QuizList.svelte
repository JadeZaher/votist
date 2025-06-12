<script lang="ts">
	import type { Quiz } from '$lib/types';
	import { goto } from '$app/navigation';

	export let quizzes: Quiz[];

	async function handleDelete(id: string) {
		if (!confirm('Are you sure you want to delete this quiz?')) return;

		const response = await fetch(`/api/quizzes/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			window.location.reload();
		}
	}

	async function toggleStatus(quiz: Quiz) {
		const response = await fetch(`/api/quizzes/${quiz.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ enabled: !quiz.enabled })
		});

		if (response.ok) {
			window.location.reload();
		}
	}
</script>

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
			{#each quizzes as quiz (quiz.id)}
				<tr>
					<td>{quiz.title}</td>
					<td>
						<div class="badge" data-difficulty={quiz.difficulty.toLowerCase()}>
							{quiz.difficulty}
						</div>
					</td>
					<td>{quiz.questions?.length || 0} questions</td>
					<td>
						<button class="btn btn-sm btn-ghost" on:click={() => toggleStatus(quiz)}>
							<div class="badge badge-{quiz.enabled ? 'success' : 'ghost'}">
								{quiz.enabled ? 'Active' : 'Disabled'}
							</div>
						</button>
					</td>
					<td>
						<div class="flex gap-2">
							<a 
									href="/admin/quizzes/{quiz.id}/edit"
									class="btn btn-sm"
							>
									Edit
							</a>
							<button class="btn btn-sm btn-error" on:click={() => handleDelete(quiz.id)}>
									Delete
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
