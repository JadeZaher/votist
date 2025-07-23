<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { dev } from '$app/environment';
	import type { Quiz, Question, Option } from '$lib/types';

	interface PageData {
		quiz: Quiz;
	}

	let { data }: { data: PageData } = $props();

	let currentQuestionIndex = $state(0);
	let selectedAnswer = $state<string | null>(null);
	let userAnswers = $state<Record<string, string>>({});
	let showFeedback = $state(false);
	let isAnswerCorrect = $state<boolean | null>(false);

	const currentQuestion = $derived(data.quiz.questions[currentQuestionIndex]);
	const isLastQuestion = $derived(currentQuestionIndex === data.quiz.questions.length - 1);
	const progressPercentage = $derived(
		((currentQuestionIndex + 1) / data.quiz.questions.length) * 100
	);

	onMount(async () => {
		try {
			await fetch(`/api/userProgress/${data.quiz.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: 'IN_PROGRESS' })
			});
		} catch (error) {
			if (dev) console.error('Failed to update progress:', error);
		}
	});

	function selectAnswer(answer: string) {
		if (!showFeedback) {
			selectedAnswer = answer;
		}
	}

	function checkAnswer() {
		if (!selectedAnswer || !currentQuestion) return;

		const correctOption = currentQuestion.options.find((option: Option) => option.isCorrect);
		const selectedOption = currentQuestion.options.find(
			(option: Option) => option.text === selectedAnswer
		);

		const isNoOpinion = selectedOption?.isNoOpinion || false;

		if (isNoOpinion) {
			isAnswerCorrect = null;
		} else {
			isAnswerCorrect = selectedOption?.isCorrect || false;
		}

		userAnswers[currentQuestion.id] = selectedAnswer;
		showFeedback = true;
	}

	function nextQuestion() {
		if (isLastQuestion) {
			completeQuiz();
		} else {
			currentQuestionIndex++;
			selectedAnswer = null;
			showFeedback = false;
		}
	}

	async function completeQuiz() {
		try {
			let correctAnswers = 0;
			let scorableQuestions = 0;
			const totalQuestions = data.quiz.questions.length;

			for (const question of data.quiz.questions) {
				const userAnswer = userAnswers[question.id];

				if (userAnswer) {
					const selectedOption = question.options.find(
						(option: Option) => option.text === userAnswer
					);

					if (selectedOption && selectedOption.isNoOpinion) {
						// Skip "no opinion" answers - they don't count toward score
					} else {
						scorableQuestions++;
						if (selectedOption && selectedOption.isCorrect) {
							correctAnswers++;
						}
					}
				} else {
					// No answer provided - counts as incorrect
					scorableQuestions++;
				}
			}

			const denominator = scorableQuestions > 0 ? scorableQuestions : totalQuestions;
			const score = Math.round((correctAnswers / denominator) * 100);
			const passed = score >= (data.quiz.passingScore || 60);

			if (dev) {
				console.log('=== SCORING SUMMARY ===');
				console.log(`Total questions: ${totalQuestions}`);
				console.log(`Scorable questions: ${scorableQuestions}`);
				console.log(`Correct answers: ${correctAnswers}`);
				console.log(`Score: ${score}% (${correctAnswers}/${denominator})`);
				console.log(`Passing score: ${data.quiz.passingScore}%`);
				console.log(`Passed: ${passed}`);
				console.log('======================');
			}

			const response = await fetch('/api/quizCompletion', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					quizId: data.quiz.id,
					score,
					answers: userAnswers,
					completed: true,
					passed: passed
				})
			});

			if (!response.ok) {
				throw new Error(`Quiz completion failed: ${response.status}`);
			}

			await invalidateAll();

			if (passed) {
				goto(`/quiz/${data.quiz.id}/results`);
			} else {
				goto('/quiz');
			}
		} catch (error) {
			if (dev) console.error('Failed to complete quiz:', error);
			goto('/quiz');
		}
	}

	function getCorrectAnswer() {
		if (!currentQuestion) return '';
		const correctOption = currentQuestion.options.find((option: Option) => option.isCorrect);
		return correctOption?.text || '';
	}
</script>

<div class="bg-base-100 min-h-screen py-8">
	<div class="container mx-auto px-4">
		{#if !showFeedback}
			<!-- Question Screen -->
			<div class="card bg-base-100 mx-auto w-full max-w-4xl shadow-xl">
				<div class="card-body">
					<!-- Progress Bar -->
					<div class="mb-6">
						<div class="text-base-content mb-2 flex justify-between text-sm">
							<span>Q. {currentQuestionIndex + 1} of {data.quiz.questions.length}</span>
							<span>{Math.round(progressPercentage)}% Complete</span>
						</div>
						<progress class="progress progress-primary" value={progressPercentage} max="100"
						></progress>
					</div>

					<!-- Quiz Title -->
					<div class="mb-4 text-center">
						<h1 class="text-primary text-2xl font-bold">{data.quiz.title}</h1>
						<p class="text-base-content/70">{data.quiz.description}</p>
					</div>

					<!-- Question Title -->
					<h2 class="text-primary mb-8 text-center text-3xl font-bold">
						{currentQuestion?.title}
					</h2>

					{#if currentQuestion?.description}
						<p class="text-base-content mb-6 text-center text-lg">{currentQuestion.description}</p>
					{/if}

					<!-- Answer Options -->
					<div class="mb-8 space-y-4">
						{#each currentQuestion?.options || [] as option, index}
							<button
								class="btn btn-lg w-full justify-start text-left {selectedAnswer === option.text
									? option.isNoOpinion
										? 'btn-neutral'
										: 'btn-primary'
									: option.isNoOpinion
										? 'btn-outline btn-neutral'
										: 'btn-outline btn-primary'}"
								onclick={() => selectAnswer(option.text)}
							>
								<span
									class="badge badge-outline mr-3 {option.isNoOpinion
										? 'badge-neutral'
										: 'badge-primary'}"
								>
									{option.isNoOpinion ? '?' : String.fromCharCode(65 + index)}
								</span>
								{option.text}
								{#if option.isNoOpinion}
									<span class="text-neutral-content/70 ml-auto text-sm">(No Opinion)</span>
								{/if}
							</button>
						{/each}
					</div>

					<!-- Action Buttons -->
					<div class="card-actions justify-center">
						<button class="btn btn-primary btn-lg" onclick={checkAnswer} disabled={!selectedAnswer}>
							{#if !selectedAnswer}
								<span class="loading loading-spinner loading-sm"></span>
							{/if}
							Submit Answer
						</button>
					</div>
				</div>
			</div>
		{:else}
			<!-- Feedback Screen -->
			<div class="card bg-base-100 mx-auto w-full max-w-4xl shadow-xl">
				<div class="card-body">
					<!-- Progress Bar -->
					<div class="mb-6">
						<div class="text-base-content mb-2 flex justify-between text-sm">
							<span>Q. {currentQuestionIndex + 1} of {data.quiz.questions.length}</span>
							<span>{Math.round(progressPercentage)}% Complete</span>
						</div>
						<progress class="progress progress-primary" value={progressPercentage} max="100"
						></progress>
					</div>

					<!-- Question Title -->
					<h2 class="text-primary mb-8 text-center text-3xl font-bold">
						{currentQuestion?.title}
					</h2>

					<!-- Answer Options with Feedback -->
					<div class="mb-8 space-y-4">
						{#each currentQuestion?.options || [] as option, index}
							<button
								class="btn btn-lg w-full justify-start text-left
								{selectedAnswer === option.text
									? option.isNoOpinion
										? 'btn-neutral'
										: 'btn-primary'
									: 'btn-outline btn-neutral'}
								{option.isCorrect ? 'btn-success' : ''}"
								disabled={true}
							>
								<span
									class="badge badge-outline mr-3
									{option.isCorrect
										? 'badge-success'
										: selectedAnswer === option.text
											? option.isNoOpinion
												? 'badge-neutral'
												: 'badge-primary'
											: 'badge-neutral'}"
								>
									{option.isNoOpinion ? '?' : String.fromCharCode(65 + index)}
								</span>
								{option.text}
								{#if option.isCorrect}
									<span class="text-success ml-auto">✓ Correct</span>
								{/if}
								{#if selectedAnswer === option.text && !option.isCorrect && !option.isNoOpinion}
									<span class="text-error ml-auto">✗ Your Answer</span>
								{/if}
								{#if selectedAnswer === option.text && option.isNoOpinion}
									<span class="text-neutral-content/70 ml-auto">~ No Opinion</span>
								{/if}
							</button>
						{/each}
					</div>

					<!-- Feedback Message -->
					<div class="mb-6 text-center">
						{#if isAnswerCorrect === true}
							<div class="alert alert-success">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 shrink-0 stroke-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>Correct! Well done.</span>
							</div>
						{:else if isAnswerCorrect === null}
							<div class="alert alert-neutral">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 shrink-0 stroke-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>No opinion selected. This won't affect your score.</span>
							</div>
						{:else}
							<div class="alert alert-info">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 shrink-0 stroke-current"
									fill="none"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<span>The correct answer is: {getCorrectAnswer()}</span>
							</div>
						{/if}
					</div>

					<!-- Next Button -->
					<div class="card-actions justify-center">
						<button class="btn btn-primary btn-lg" onclick={nextQuestion}>
							{isLastQuestion ? 'Complete Quiz' : 'Next Question'}
						</button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
