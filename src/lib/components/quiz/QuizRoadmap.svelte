<script lang="ts">
	import type { QuizDifficulty } from '$lib/types';
	import type { QuizStatus } from '@prisma/client';

	interface QuizLevel {
		id: QuizDifficulty;
		label: string;
		letter: string;
		color: string;
	}

	interface QuizWithProgress {
		id: string;
		title: string;
		difficulty: QuizDifficulty;
		sequence: number;
		status: QuizStatus;
		prerequisiteId?: string;
	}

	const levels: QuizLevel[] = [
		{ id: 'VOTIST', label: 'Votist', letter: 'V', color: 'bg-primary' },
		{ id: 'SCHOLAR', label: 'Scholar', letter: 'S', color: 'bg-secondary' },
		{ id: 'MENTOR', label: 'Mentor', letter: 'M', color: 'bg-accent' }
	];

	export let quizzes: QuizWithProgress[] = [];

	// Group quizzes by difficulty
	let groupedQuizzes = quizzes.reduce(
		(groups, quiz) => {
			(groups[quiz.difficulty] = groups[quiz.difficulty] || []).push(quiz);
			return groups;
		},
		{} as Record<string, QuizWithProgress[]>
	);

	const difficultyOrder = ['VOTIST', 'SCHOLAR', 'MENTOR'];
	groupedQuizzes = Object.fromEntries(
		Object.entries(groupedQuizzes).sort(
			([a], [b]) => difficultyOrder.indexOf(a) - difficultyOrder.indexOf(b)
		)
	);

	function getQuizStatusClass(quiz: QuizWithProgress): string {
		switch (quiz.status) {
			case 'AVAILABLE':
				return 'badge-success';
			case 'COMPLETED':
				return 'badge-primary';
			case 'IN_PROGRESS':
				return 'badge-warning';
			default:
				return 'badge-neutral';
		}
	}

	function canTakeQuiz(quiz: QuizWithProgress): boolean {
		return quiz.status === 'AVAILABLE';
	}

	function takeQuiz(quizId: string) {
		// Redirect to the quiz page
		window.location.href = `/quiz/${quizId}`;
	}
</script>

<div class="relative w-[1168px] overflow-hidden">
	<!-- Quiz Roadmap Title -->
	<div
		class="absolute top-[538px] left-[137px] font-['Roboto'] text-3xl leading-[48.24px] font-bold text-cyan-700"
	>
		Housing Assembly Quiz Roadmap
	</div>

	<!-- Levels -->
	{#if quizzes.length === 0}
		<p class="text-center text-gray-500">No quizzes available</p>
	{:else}
		{#each Object.keys(groupedQuizzes) as difficulty}
			<div class="mt-8">
				<h2 class="text-lg font-bold">{difficulty}</h2>
				<table class="table w-full table-fixed">
					<thead>
						<tr>
							<th class="w-1/12">Order</th>
							<th class="w-1/6">Title</th>
							<th class="w-1/6">Status</th>
							<th class="w-1/6">Action</th>
						</tr>
					</thead>
					<tbody>
						{#each groupedQuizzes[difficulty] as quiz, index}
							<tr>
								<td>{index + 1}</td>
								<td>{quiz.title}</td>
								<td>
									<div class="badge {getQuizStatusClass(quiz)}">
										{quiz.status}
									</div>
								</td>
								<td>
									<button
										class="btn btn-primary btn-sm"
										disabled={!canTakeQuiz(quiz)}
										on:click={() => takeQuiz(quiz.id)}
									>
										Take Quiz
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	{/if}
</div>
