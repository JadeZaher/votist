<script lang="ts">
	import type { Quiz } from '$lib/types';

	export let quizzes: Quiz[];

	// Group quizzes by difficulty and sort by sequence within each group
	// This will create an object where keys are difficulty levels and values are arrays of quizzes
	// Example: { Votist: [quiz1, quiz2], Scholar: [quiz3], Mentor: [quiz4, quiz5] }
	let groupedQuizzes = quizzes.reduce(
		(groups, quiz) => {
			(groups[quiz.difficulty] = groups[quiz.difficulty] || []).push(quiz);
			return groups;
		},
		{} as Record<string, Quiz[]>
	);

	const difficultyOrder = ['Votist', 'Scholor', 'Mentor'];
	groupedQuizzes = Object.fromEntries(
		Object.entries(groupedQuizzes).sort(
			([a], [b]) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b)
		)
	);

	async function moveUp(difficulty: string, index: number) {
		if (index === 0) return;
		const group = groupedQuizzes[difficulty];
		[group[index - 1], group[index]] = [group[index], group[index - 1]];
		await updateSequence(group);
	}

	async function moveDown(difficulty: string, index: number) {
		const group = groupedQuizzes[difficulty];
		if (index === group.length - 1) return;
		[group[index], group[index + 1]] = [group[index + 1], group[index]];
		await updateSequence(group);
	}

	let updatingSequence = false;

	async function updateSequence(group: Quiz[]) {
		const updates = group.map((quiz, index) => ({
			id: quiz.id,
			sequence: index + 1
		}));

		try {
			updatingSequence = true;
			await fetch('/api/quizzes/update-sequence', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updates)
			});
			window.location.reload();
		} catch (error) {
			console.error('Error updating sequence:', error);
		} finally {
			updatingSequence = false;
		}
	}

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
	<!-- Quiz Table -->
	{#each Object.keys(groupedQuizzes) as difficulty}
		<h2 class="mb-2 text-lg font-bold">{difficulty}</h2>
		<table class="mb-6 table w-full table-fixed">
			<thead>
				<tr>
					<th class="w-1/12">Order</th>
					<th class="w-1/6">Title</th>
					<th class="w-1/6">Questions</th>
					<th class="w-1/6">Points</th>
					<th class="w-1/6">Status</th>
					<th class="w-1/6">Actions</th>
					<th class="w-1/6">Move</th>
				</tr>
			</thead>
			<tbody>
				{#each groupedQuizzes[difficulty] as quiz, index}
					<tr>
						<td>{index + 1}</td>
						<td>{quiz.title}</td>
						<td>{quiz.questionCount} questions</td>
						<td>
							<div class="badge badge-neutral">{quiz.points} points</div>
						</td>
						<td>
							<button class="btn btn-sm btn-ghost" on:click={() => toggleStatus(quiz)}>
								<div class="badge badge-{quiz.enabled ? 'success' : 'ghost'}">
									{quiz.enabled ? 'Active' : 'Disabled'}
								</div>
							</button>
						</td>
						<td>
							<div class="flex gap-2">
								<a href="/admin/quizzes/{quiz.id}/edit" class="btn btn-sm">Edit</a>
								<button class="btn btn-sm btn-error" on:click={() => handleDelete(quiz.id)}>
									Delete
								</button>
							</div>
						</td>
						<td>
							<div class="flex">
								<button
									class="btn btn-sm btn-ghost"
									on:click={() => moveUp(difficulty, index)}
									aria-label="Move quiz up"
									disabled={updatingSequence}
								>
									↑
								</button>
								<button
									class="btn btn-sm btn-ghost"
									on:click={() => moveDown(difficulty, index)}
									aria-label="Move quiz down"
									disabled={updatingSequence}
								>
									↓
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
</div>
