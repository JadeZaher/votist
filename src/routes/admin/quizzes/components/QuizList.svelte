<script lang="ts">
	import type { Quiz } from '$lib/types';

	export let quizzes: Quiz[];

	// Group quizzes by difficulty
	const grouped = {
		VOTIST: [],
		SCHOLAR: [],
		MENTOR: []
	} as Record<string, Quiz[]>;

	for (const quiz of quizzes) {
		const diff = quiz.difficulty || 'VOTIST';
		if (!grouped[diff]) grouped[diff] = [];
		grouped[diff].push(quiz);
	}

	async function moveUp(index: number, group: Quiz[]) {
		if (index === 0) return;
		[group[index - 1], group[index]] = [group[index], group[index - 1]];
		await updateSequence(group);
	}

	async function moveDown(index: number, group: Quiz[]) {
		if (index === group.length - 1) return;
		[group[index], group[index + 1]] = [group[index + 1], group[index]];
		await updateSequence(group);
	}

	let updatingSequence = false;

	async function updateSequence(list: Quiz[]) {
		const updates = list.map((quiz, index) => ({
			...quiz,
			order: index + 1
		}));
		try {
			updatingSequence = true;
			await Promise.all(
				updates.map(async (quiz) => {
					const res = await fetch(`/api/quizzes/${quiz.id}`, {
						method: 'PUT',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							title: quiz.title,
							description: quiz.description,
							passingScore: quiz.passingScore,
							associatedMaterialId: quiz.associatedMaterialId,
							order: quiz.order,
							questions: quiz.questions,
							difficulty: quiz.difficulty
						})
					});
					if (!res.ok) {
						console.error(`Failed to update quiz order for ${quiz.id}`);
					}
				})
			);
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
</script>

<div class="space-y-8 overflow-x-auto">
	{#each Object.entries(grouped) as [difficulty, group]}
		<div>
			<h2 class="mb-2 text-xl font-bold">{difficulty} Quizzes</h2>
			<table class="mb-6 table w-full table-fixed">
				<thead>
					<tr>
						<th class="w-1/12">Order</th>
						<th class="w-1/6">Title</th>
						<th class="w-1/6">Questions</th>
						<th class="w-1/6">Actions</th>
						<th class="w-1/6">Move</th>
					</tr>
				</thead>
				<tbody>
					{#each group as quiz, index}
						<tr>
							<td>{index + 1}</td>
							<td>{quiz.title}</td>
							<td>{quiz.questions ? quiz.questions.length : 0} questions</td>
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
										on:click={() => moveUp(index, group)}
										aria-label="Move quiz up"
										disabled={updatingSequence}
									>
										↑
									</button>
									<button
										class="btn btn-sm btn-ghost"
										on:click={() => moveDown(index, group)}
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
		</div>
	{/each}
</div>
