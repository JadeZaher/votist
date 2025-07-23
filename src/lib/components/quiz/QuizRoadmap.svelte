<script lang="ts">
	import { goto } from '$app/navigation';
	import { QuizDifficulty } from '$lib/types';
	import type { QuizWithProgress } from '$lib/types';

	interface QuizLevel {
		id: QuizDifficulty;
		label: string;
		letter: string;
		color: string;
		bgColor: string;
		textColor: string;
	}

	interface Props {
		quizzes?: QuizWithProgress[];
	}

	const levels: QuizLevel[] = [
		{
			id: QuizDifficulty.VOTIST,
			label: 'Votist',
			letter: 'V',
			color: 'bg-primary',
			bgColor: 'bg-slate-500',
			textColor: 'text-slate-500'
		},
		{
			id: QuizDifficulty.SCHOLAR,
			label: 'Scholar',
			letter: 'S',
			color: 'bg-secondary',
			bgColor: 'bg-cyan-800',
			textColor: 'text-cyan-800'
		},
		{
			id: QuizDifficulty.MENTOR,
			label: 'Mentor',
			letter: 'M',
			color: 'bg-accent',
			bgColor: 'bg-amber-400',
			textColor: 'text-amber-400'
		}
	];

	let { quizzes = [] }: Props = $props();

	const groupedQuizzes = $derived(() => {
		const groups = quizzes.reduce(
			(groups, quiz) => {
				(groups[quiz.difficulty] = groups[quiz.difficulty] || []).push(quiz);
				return groups;
			},
			{} as Record<QuizDifficulty, QuizWithProgress[]>
		);

		Object.keys(groups).forEach((difficulty) => {
			groups[difficulty as QuizDifficulty].sort((a, b) => a.sequence - b.sequence);
		});

		const difficultyOrder: QuizDifficulty[] = [
			QuizDifficulty.VOTIST,
			QuizDifficulty.SCHOLAR,
			QuizDifficulty.MENTOR
		];

		return Object.fromEntries(
			Object.entries(groups).sort(
				([a], [b]) =>
					difficultyOrder.indexOf(a as QuizDifficulty) -
					difficultyOrder.indexOf(b as QuizDifficulty)
			)
		) as Record<QuizDifficulty, QuizWithProgress[]>;
	});

	function getQuizStatusIcon(quiz: QuizWithProgress): string {
		switch (quiz.status) {
			case 'AVAILABLE':
				return 'bg-slate-500';
			case 'COMPLETED':
				return 'bg-green-600';
			case 'IN_PROGRESS':
				return 'bg-amber-500';
			default:
				return 'bg-stone-300';
		}
	}

	function getQuizStatusIconContent(quiz: QuizWithProgress): string {
		switch (quiz.status) {
			case 'COMPLETED':
				return '✓';
			case 'AVAILABLE':
				return '▶';
			case 'IN_PROGRESS':
				return '⏵';
			default:
				return '🔒';
		}
	}

	function canTakeQuiz(quiz: QuizWithProgress): boolean {
		return (
			quiz.status === 'AVAILABLE' || quiz.status === 'IN_PROGRESS' || quiz.status === 'COMPLETED'
		);
	}

	async function takeQuiz(quiz: QuizWithProgress) {
		if (quiz.status === 'COMPLETED') {
			goto(`/quiz/${quiz.id}/results`);
		} else if (quiz.status === 'AVAILABLE' || quiz.status === 'IN_PROGRESS') {
			goto(`/quiz/${quiz.id}`);
		}
	}

	function startFirstAvailableQuiz() {
		const firstAvailable = quizzes.find((q) => q.status === 'AVAILABLE');
		if (firstAvailable) {
			goto(`/quiz/${firstAvailable.id}`);
		}
	}

	const allQuizzesCompleted = $derived(
		quizzes.length > 0 && quizzes.every((q) => q.status === 'COMPLETED')
	);

	const nextAvailableQuiz = $derived(quizzes.find((q) => q.status === 'AVAILABLE'));
</script>

<div class="mx-auto w-full max-w-4xl p-4">
	<!-- Level Badge -->
	<div class="mb-6">
		<div class="inline-flex items-center gap-4 rounded px-4 py-2">
			<div class="text-xl font-bold text-cyan-800">Level 01</div>
		</div>
	</div>

	<!-- Main Title -->
	<div class="mb-8">
		<h1 class="mb-6 text-3xl font-semibold text-cyan-700">San Rafael, Location</h1>
	</div>

	<!-- Introduction Text -->
	<div class="mb-8">
		<div class="mb-6 flex items-start gap-4">
			<div class="text-5xl font-black text-cyan-700">1</div>
			<p class="pt-4 text-2xl leading-loose text-stone-900">
				Votist requires a short quiz before voting to ensure every voice is informed.
			</p>
		</div>
		<div class="mb-8 flex items-start gap-4">
			<div class="text-5xl font-black text-cyan-700">2</div>
			<p class="pt-4 text-2xl leading-loose text-stone-900">
				Each quiz you pass increases the power of your vote.
			</p>
		</div>
	</div>

	<!-- Start Button -->
	<div class="mb-12">
		<button
			onclick={startFirstAvailableQuiz}
			disabled={allQuizzesCompleted}
			class="rounded px-8 py-3 text-2xl text-white transition-colors {allQuizzesCompleted
				? 'cursor-not-allowed bg-gray-500'
				: 'bg-cyan-700 hover:bg-cyan-800'}"
		>
			{allQuizzesCompleted ? 'Done' : 'Start'}
		</button>
	</div>

	<!-- Quiz Roadmap Title -->
	<div class="mb-8">
		<h2 class="text-3xl leading-12 font-bold text-cyan-700">Housing Assembly Quiz Roadmap</h2>
	</div>

	<!-- Quiz Count -->
	<div class="mb-8 flex items-center gap-4">
		<div class="text-lg">📖</div>
		<span class="text-base leading-7 text-stone-900">{quizzes.length} Quizzes</span>
	</div>

	<!-- Levels -->
	{#if quizzes.length === 0}
		<div class="text-center">
			<p class="text-base-content/70">No quizzes available</p>
		</div>
	{:else}
		{#each levels as level, levelIndex}
			{#if groupedQuizzes()[level.id]?.length > 0}
				<div class="relative mb-16">
					<!-- Connecting Line (except for last level) -->
					{#if levelIndex < levels.length - 1 && groupedQuizzes()[levels[levelIndex + 1].id]?.length > 0}
						<div class="absolute top-14 left-7 h-16 w-0.5 bg-gray-300"></div>
					{/if}

					<!-- Level Header -->
					<div class="mb-8 flex items-center gap-4">
						<!-- Level Badge -->
						<div
							class="h-14 w-14 {level.bgColor} relative z-10 flex items-center justify-center rounded-full"
						>
							<span class="text-2xl font-semibold text-white">{level.letter}</span>
						</div>
						<div class="{level.textColor} text-2xl font-bold">{level.label}</div>
					</div>

					<!-- Quizzes List -->
					<div class="ml-7 space-y-6">
						{#each groupedQuizzes()[level.id] as quiz, quizIndex}
							<div class="relative flex items-center gap-6">
								<!-- Connecting lines between quizzes -->
								{#if quizIndex < groupedQuizzes()[level.id].length - 1}
									<div class="absolute top-14 left-7 h-6 w-0.5 bg-gray-200"></div>
								{/if}

								<!-- Start Badge for next available quiz -->
								{#if nextAvailableQuiz && quiz.id === nextAvailableQuiz.id}
									<div class="absolute -top-16 left-1">
										<div class="relative h-11 w-16 rounded-md bg-slate-500">
											<!-- Arrow -->
											<div class="absolute -bottom-1 left-9 h-2 w-2 rotate-45 bg-slate-500"></div>
											<div class="pt-2 text-center text-base leading-7 font-bold text-white">
												Start
											</div>
										</div>
									</div>
								{/if}

								<!-- Quiz Status Icon -->
								<button
									onclick={() => takeQuiz(quiz)}
									disabled={!canTakeQuiz(quiz)}
									aria-label="{quiz.status === 'COMPLETED'
										? 'View results for'
										: quiz.status === 'AVAILABLE' || quiz.status === 'IN_PROGRESS'
											? 'Take quiz:'
											: 'Quiz locked:'} {quiz.title}"
									class="h-14 w-14 {getQuizStatusIcon(
										quiz
									)} flex items-center justify-center rounded-lg transition-colors {canTakeQuiz(
										quiz
									)
										? 'cursor-pointer hover:opacity-80'
										: 'cursor-not-allowed'} relative z-10"
								>
									<span class="text-lg text-white">
										{getQuizStatusIconContent(quiz)}
									</span>
								</button>

								<!-- Quiz Title -->
								<div class="text-base leading-relaxed text-black">
									{quiz.title}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
