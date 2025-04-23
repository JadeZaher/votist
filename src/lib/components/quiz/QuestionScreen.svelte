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
  
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="mb-8">
      <!-- <img 
        src={currentQuestion.image} 
        alt="Quiz question image" 
        class="w-full h-64 object-cover rounded-md mb-4"
      />
       -->

       <video
            class="z-[-1] size-full max-w-xl origin-left -translate-x-4 scale-[160%] lg:max-w-[34vw]"
            src={currentQuestion.video}
            autoplay
            playsinline
            loop
            muted
        ></video>
      <h3 class="text-teal-700 text-2xl font-bold text-center mb-6">{currentQuestion.question}</h3>
      
      <div class="space-y-4">
        {#each currentQuestion.options as option}
          <button 
            class="w-full p-4 text-white font-medium rounded-md transition duration-150 text-center {$selectedAnswer === option ? 'bg-teal-700' : 'bg-teal-600 hover:bg-teal-700'}"
            on:click={() => handleSelectAnswer(option)}
          >
            {option}
          </button>
        {/each}
      </div>
      
      <div class="mt-6 text-center">
        <button 
          class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150 mr-4 {!$selectedAnswer ? 'opacity-50 cursor-not-allowed' : ''}"
          on:click={handleSubmitAnswer}
          disabled={!$selectedAnswer}
        >
          Submit
        </button>
        
        <button 
          class="px-6 py-2 bg-white text-teal-700 border border-teal-700 rounded-md shadow-sm hover:bg-gray-50 transition duration-150"
          on:click={handleSkipQuestion}
        >
          Skip
        </button>
      </div>
      
      <div class="mt-4 flex justify-between items-center text-gray-500">
        <div>{progressText}</div>
        <button 
          class="text-teal-700 hover:underline"
          on:click={handleSkipQuestion}
        >
          Skip
        </button>
      </div>
    </div>
  </div>