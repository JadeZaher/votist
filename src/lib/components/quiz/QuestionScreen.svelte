<script lang="ts">
	import {
		questions,
		currentQuestionIndex,
		selectedAnswer,
		selectAnswer,
		checkAnswer,
		skipQuestion
	} from '../../../stores/quizStore';

	$: currentQuestion = $questions[$currentQuestionIndex];
	$: progressText = `Q. ${$currentQuestionIndex + 1} of ${$questions.length}`;

	function handleSelectAnswer(option: string) {
		if (!$selectedAnswer) {
			selectAnswer(option);
		}
	}

	function handleSubmitAnswer() {
		if ($selectedAnswer) {
			checkAnswer();
		}
	}

	function handleSkipQuestion() {
		skipQuestion();
	}
</script>

<div
	class="mx-auto w-2/3 justify-center rounded-lg bg-white p-12 text-center align-middle shadow-md"
>
	<div class="mb-24">
		<video
			class="z-[-1] mx-auto size-full max-w-xl -translate-x-4 scale-[120%] lg:max-w-[34vw]"
			src={currentQuestion.video}
			autoplay
			playsinline
			loop
			muted
		></video>
		<h3 class="my-16 text-center text-5xl font-bold text-teal-700">{currentQuestion.question}</h3>

		<div class="space-y-4 text-3xl">
			{#each currentQuestion.options as option}
				<button
					class="w-2/3 rounded-md p-4 text-center font-medium text-white shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] transition duration-150 {$selectedAnswer ===
					option
						? 'bg-teal-700'
						: 'bg-teal-600 hover:bg-teal-700'}"
					on:click={() => handleSelectAnswer(option)}
				>
					{option}
				</button>
			{/each}
		</div>

		<div class="mt-6 text-center font-bold">
			<button
				class="mr-4 rounded-md bg-teal-600 px-6 py-2 text-white shadow-sm transition duration-150 hover:bg-teal-700 {!$selectedAnswer
					? 'cursor-not-allowed opacity-50'
					: ''}"
				on:click={handleSubmitAnswer}
				disabled={!$selectedAnswer}
			>
				Submit
			</button>

			<button
				class="rounded-md border border-teal-700 bg-white px-6 py-2 text-teal-700 shadow-sm transition duration-150 hover:bg-gray-50"
				on:click={handleSkipQuestion}
			>
				Skip
			</button>
		</div>

		<div class="mt-4 flex items-center justify-between text-2xl font-bold text-gray-500">
			<div>{progressText}</div>
			<button class="text-teal-700 hover:underline" on:click={handleSkipQuestion}> Skip </button>
		</div>
	</div>
</div>
