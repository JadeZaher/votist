<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import { dev } from '$app/environment';
	import QuizAnswerCorrectIcon from '$lib/components/icons/QuizAnswerCorrectIcon.svelte';
	import QuizAnswerIncorrectIcon from '$lib/components/icons/QuizAnswerIncorrectIcon.svelte';
	import type { Quiz, Option } from '$lib/types';

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

	function selectAnswer(answer: string) {
		if (!showFeedback) {
			selectedAnswer = answer;
		}
	}

	function checkAnswer() {
		if (!selectedAnswer || !currentQuestion) return;

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
			const totalQuestions = data.quiz.questions.length;

			for (const question of data.quiz.questions) {
				const userAnswer = userAnswers[question.id];
				if (userAnswer) {
					const selectedOption = question.options.find(
						(option: Option) => option.text === userAnswer
					);
					if (selectedOption && selectedOption.isNoOpinion) {
						// skip "no opinion" in scoring
					} else if (selectedOption && selectedOption.isCorrect) {
						correctAnswers++;
					}
				}
			}

			// Passing score is the number of correct answers required
			const passed = correctAnswers >= (data.quiz.passingScore || 1);

			if (dev) {
				console.log('=== SCORING SUMMARY ===');
				console.log(`Total questions: ${totalQuestions}`);
				console.log(`Correct answers: ${correctAnswers}`);
				console.log(`Passing score (number correct): ${data.quiz.passingScore}`);
				console.log(`Passed: ${passed}`);
				console.log('======================');
			}

			const response = await fetch(`/api/userProgress/${data.quiz.id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					quizId: data.quiz.id,
					quizScore: correctAnswers,
					isCompleted: passed,
					completedAt: passed ? new Date().toISOString() : null,
					answers: userAnswers
				})
			});

			if (!response.ok) {
				throw new Error(`Quiz completion failed: ${response.status}`);
			}

			await invalidateAll();
			goto(`/san-rafael/quiz/${data.quiz.id}/results`);
		} catch (error) {
			if (dev) console.error('Failed to complete quiz:', error);
			//goto('/san-rafael/quizzes');
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
		<div class="flex flex-col items-center justify-center">
			<!-- Progress Bar -->
			<div class="mb-6 w-full max-w-2xl">
				<div class="text-base-content mb-2 flex justify-between text-sm">
					<span>Question {currentQuestionIndex + 1} of {data.quiz.questions.length}</span>
					<span>{Math.round(progressPercentage)}%</span>
				</div>
				<progress class="progress progress-primary w-full" value={progressPercentage} max="100"
				></progress>
			</div>

			<!-- Quiz Card -->
			<div
				class="card bg-base-100 w-full max-w-5xl p-0 shadow-xl md:p-8"
				style="font-family: Arial, Raleway, sans-serif;"
			>
				<div class="relative flex min-h-[600px] w-full flex-col items-center justify-center">
					<!-- Question Title -->
					<div
						class="mx-auto mt-4 w-full text-center text-2xl leading-[40px] font-bold text-stone-900 md:mt-0 md:w-[924px] md:text-3xl md:leading-[48px]"
					>
						{currentQuestion?.text}
					</div>
					<!-- Quiz Description -->
					<div
						class="mx-auto mt-2 mb-4 w-full text-center text-base leading-relaxed font-normal text-neutral-600 md:w-[500px]"
					>
						{data.quiz.description}
					</div>
					<!-- Answer Options -->
					<div class="flex w-full flex-col items-center gap-3 px-2 pb-3 md:px-80">
						{#each currentQuestion?.options || [] as option, index}
							{#if showFeedback}
								<!-- Feedback state: show correct/incorrect styling -->
								<div
									class="inline-flex w-full items-center justify-start gap-6 rounded-md px-2 py-3 text-left outline outline-offset-[-1px] md:w-[872px] md:gap-8 md:px-6"
									class:bg-cyan-100={option.isCorrect}
									class:outline-cyan-600={option.isCorrect}
									class:bg-gray-200={selectedAnswer === option.text && !option.isCorrect}
									class:outline-neutral-400={selectedAnswer !== option.text || option.isCorrect}
									class:bg-white={selectedAnswer !== option.text && !option.isCorrect}
								>
									{#if option.isCorrect}
										<QuizAnswerCorrectIcon />
									{:else if selectedAnswer === option.text}
										<QuizAnswerIncorrectIcon />
									{/if}
									<div
										class="w-full text-base leading-tight font-normal text-stone-900 md:w-[798px]"
									>
										{option.text}
										{#if option.isNoOpinion}
											<span class="text-neutral-content/70 ml-2 text-sm">(No Opinion)</span>
										{/if}
									</div>
								</div>
							{:else}
								<!-- Default state: interactive buttons -->
								<button
									type="button"
									class="inline-flex w-full justify-start gap-6 rounded-md px-4 py-5 text-left text-base leading-tight font-normal text-stone-900 outline-1 outline-offset-[-1px] transition-all duration-150 md:w-[872px] md:gap-12 md:px-11"
									class:bg-white={selectedAnswer !== option.text}
									class:bg-primary-10={selectedAnswer === option.text}
									class:outline-neutral-400={selectedAnswer !== option.text}
									class:outline-primary={selectedAnswer === option.text}
									onclick={() => selectAnswer(option.text)}
									disabled={showFeedback}
								>
									<div class="w-full justify-center md:w-[798px]">
										{option.text}
										{#if option.isNoOpinion}
											<span class="text-neutral-content/70 ml-2 text-sm">(No Opinion)</span>
										{/if}
									</div>
								</button>
							{/if}
						{/each}
					</div>

					<!-- Continue/Submit Button -->
					<div class="mt-8 flex w-full justify-center">
						{#if !showFeedback}
							<button
								class="btn btn-primary w-full rounded-md px-8 py-2 text-base font-bold text-white md:w-auto"
								onclick={checkAnswer}
								disabled={!selectedAnswer}
								type="button"
							>
								{#if !selectedAnswer}
									<span class="loading loading-spinner loading-sm"></span>
								{:else}
									Continue
								{/if}
							</button>
						{:else}
							<button
								class="btn btn-primary w-full rounded-md px-8 py-2 text-base font-bold text-white md:w-auto"
								onclick={nextQuestion}
								type="button"
							>
								{isLastQuestion ? 'Complete Quiz' : 'Continue'}
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
