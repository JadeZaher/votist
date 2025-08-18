<script lang="ts">
	import QuizLevel from '$lib/components/quiz/QuizLevel.svelte';
	import type { Quiz } from '$lib/types';

	export let quizzes: Quiz[] = [];
	export let completedQuizIds: string[] = [];
	export let userProgress: Record<string, any>;

	const levels = [
		{
			id: 'VOTIST' as const,
			label: 'Votist',
			letter: 'V',
			bgColor: 'bg-[#6F9C83]',
			textColor: 'text-[#6F9C83]'
		},
		{
			id: 'SCHOLAR' as const,
			label: 'Scholar',
			letter: 'S',
			bgColor: 'bg-cyan-800',
			textColor: 'text-cyan-800'
		},
		{
			id: 'MENTOR' as const,
			label: 'Mentor',
			letter: 'M',
			bgColor: 'bg-amber-400',
			textColor: 'text-amber-400'
		}
	];

	$: grouped = {
		VOTIST: quizzes.filter((q) => q.difficulty === 'VOTIST').sort((a, b) => a.order - b.order),
		SCHOLAR: quizzes.filter((q) => q.difficulty === 'SCHOLAR').sort((a, b) => a.order - b.order),
		MENTOR: quizzes.filter((q) => q.difficulty === 'MENTOR').sort((a, b) => a.order - b.order)
	};

	function getQuizStatus(quiz: Quiz): 'completed' | 'available' | 'locked' {
		if (completedQuizIds.includes(quiz.id)) {
			return 'completed';
		}

		if (quiz.difficulty === 'VOTIST') {
			const votistQuizzes = grouped.VOTIST;
			const currentIndex = votistQuizzes.findIndex((q) => q.id === quiz.id);

			if (currentIndex === 0) return 'available';

			const previousQuizzes = votistQuizzes.slice(0, currentIndex);
			return previousQuizzes.every((q) => completedQuizIds.includes(q.id)) ? 'available' : 'locked';
		}

		if (quiz.difficulty === 'SCHOLAR') {
			const allVotistCompleted = grouped.VOTIST.every((q) => completedQuizIds.includes(q.id));
			if (!allVotistCompleted) return 'locked';

			const scholarQuizzes = grouped.SCHOLAR;
			const currentIndex = scholarQuizzes.findIndex((q) => q.id === quiz.id);

			if (currentIndex === 0) return 'available';

			const previousQuizzes = scholarQuizzes.slice(0, currentIndex);
			return previousQuizzes.every((q) => completedQuizIds.includes(q.id)) ? 'available' : 'locked';
		}

		if (quiz.difficulty === 'MENTOR') {
			const allVotistCompleted = grouped.VOTIST.every((q) => completedQuizIds.includes(q.id));
			const allScholarCompleted = grouped.SCHOLAR.every((q) => completedQuizIds.includes(q.id));
			if (!allVotistCompleted || !allScholarCompleted) return 'locked';

			const mentorQuizzes = grouped.MENTOR;
			const currentIndex = mentorQuizzes.findIndex((q) => q.id === quiz.id);

			if (currentIndex === 0) return 'available';

			const previousQuizzes = mentorQuizzes.slice(0, currentIndex);
			return previousQuizzes.every((q) => completedQuizIds.includes(q.id)) ? 'available' : 'locked';
		}

		return 'locked';
	}

	$: nextAvailableQuiz = (() => {
		for (const quiz of grouped.VOTIST) {
			if (getQuizStatus(quiz) === 'available') return quiz;
		}
		for (const quiz of grouped.SCHOLAR) {
			if (getQuizStatus(quiz) === 'available') return quiz;
		}
		for (const quiz of grouped.MENTOR) {
			if (getQuizStatus(quiz) === 'available') return quiz;
		}
		return null;
	})();

	function canTakeQuiz(quiz: Quiz): boolean {
		return getQuizStatus(quiz) === 'available';
	}

	function takeQuiz(quiz: Quiz): void {
		if (canTakeQuiz(quiz)) {
			window.location.href = `/san-rafael/quiz/${quiz.id}`;
		}
	}
</script>

<div class="mx-auto w-full max-w-4xl">
	{#each levels as level}
		{#if grouped[level.id]?.length}
			<QuizLevel
				{level}
				quizzes={grouped[level.id]}
				{canTakeQuiz}
				{takeQuiz}
				{getQuizStatus}
				{nextAvailableQuiz}
				{userProgress}
			/>
		{/if}
	{/each}
</div>
