<script lang="ts">
	import {
		questions,
		currentQuestionIndex,
		selectedAnswer,
		isAnswerCorrect,
		nextQuestion
	} from '../../../stores/quizStore';

	$: currentQuestion = $questions[$currentQuestionIndex];
	$: progressText = `Q. ${$currentQuestionIndex + 1} of ${$questions.length}`;
	$: nextButtonText = $currentQuestionIndex < $questions.length - 1 ? 'Next' : 'Finish';

	function handleNextQuestion() {
		nextQuestion();
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
		<h3 class="my-16 text-center text-5xl font-bold text-teal-700">
			{currentQuestion.question}
		</h3>

		<div class="space-y-4 text-3xl">
			{#each currentQuestion.options as option}
				<button
					class="w-2/3 rounded-md p-4 text-center font-medium text-white transition duration-150
              {$selectedAnswer === option ? 'bg-teal-700' : 'bg-teal-600'} 
              {option === currentQuestion.correctAnswer ? 'bg-green-600' : ''}"
					disabled={true}
				>
					{option}
					{#if option === currentQuestion.correctAnswer}
						<span class="ml-2 text-yellow-300">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="inline h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							Correct!
						</span>
					{/if}
				</button>
			{/each}
		</div>

		{#if $isAnswerCorrect}
			<div class="mt-4 text-center">
				<p class="text-xl text-green-600">
					<span class="mr-2 inline-block h-8 w-8 rounded-full bg-yellow-500 text-center text-white">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="inline-block h-6 w-6"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
					Correct!
				</p>
			</div>
		{:else}
			<div class="mt-4 text-center">
				<p class="text-xl text-teal-600">Good try. This is the correct answer</p>
			</div>
		{/if}

		<div class="mt-6 text-right text-2xl font-bold">
			<button
				class="rounded-md bg-teal-600 px-6 py-2 text-white shadow-sm transition duration-150 hover:bg-teal-700"
				on:click={handleNextQuestion}
			>
				{nextButtonText}
			</button>
		</div>

		<div class="mt-4 flex items-center justify-between text-gray-500">
			<div>{progressText}</div>
		</div>
	</div>
</div>
