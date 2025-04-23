<script lang="ts">
    import {
        questions,
        currentQuestionIndex,
        selectedAnswer,
        isAnswerCorrect,
        nextQuestion,
    } from "../../../stores/quizStore";

    $: currentQuestion = $questions[$currentQuestionIndex];
    $: progressText = `Q. ${$currentQuestionIndex + 1} of ${$questions.length}`;
    $: nextButtonText =
        $currentQuestionIndex < $questions.length - 1 ? "Next" : "Finish";

    function handleNextQuestion() {
        nextQuestion();
    }
</script>

<div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-8">
        <!-- svelte-ignore a11y_img_redundant_alt -->
        <!-- <img 
        src={currentQuestion.image} 
        alt="Quiz question image" 
        class="w-full h-64 object-cover rounded-md mb-4"
      /> -->
        <video
            class="z-[-1] size-full max-w-xl origin-left -translate-x-4 scale-[160%] lg:max-w-[34vw]"
            src={currentQuestion.video}
            autoplay
            playsinline
            loop
            muted
        ></video>
        <h3 class="text-teal-700 text-2xl font-bold text-center mb-6">
            {currentQuestion.question}
        </h3>

        <div class="space-y-4">
            {#each currentQuestion.options as option}
                <button
                    class="w-full p-4 text-white font-medium rounded-md transition duration-150 text-center
              {$selectedAnswer === option ? 'bg-teal-700' : 'bg-teal-600'} 
              {option === currentQuestion.correctAnswer ? 'bg-green-600' : ''}"
                    disabled={true}
                >
                    {option}
                    {#if option === currentQuestion.correctAnswer}
                        <span class="ml-2 text-yellow-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 inline"
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
                <p class="text-green-600 text-xl">
                    <span
                        class="inline-block w-8 h-8 rounded-full bg-yellow-500 text-white text-center mr-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 inline-block"
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
                <p class="text-teal-600 text-xl">
                    Good try. This is the correct answer
                </p>
            </div>
        {/if}

        <div class="mt-6 text-right">
            <button
                class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150"
                on:click={handleNextQuestion}
            >
                {nextButtonText}
            </button>
        </div>

        <div class="mt-4 flex justify-between items-center text-gray-500">
            <div>{progressText}</div>
        </div>
    </div>
</div>
