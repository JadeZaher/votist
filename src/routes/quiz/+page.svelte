<script lang="ts">
    import { onMount } from 'svelte';
  
    // Types
    type QuizQuestion = {
      id: number;
      question: string;
      options: string[];
      correctAnswer: string;
      image?: string;
    };
  
    type QuizLevel = {
      id: number;
      title: string;
      description: string;
    };
  
    // Quiz state
    let currentQuizLevel: QuizLevel = {
      id: 1,
      title: "San Rafael, Location",
      description: "Level 01"
    };
  
    let questions: QuizQuestion[] = [
      {
        id: 1,
        question: "What city is this?",
        options: ["San Rafael", "Larkspur", "Novato"],
        correctAnswer: "San Rafael",
        image: "/san-rafael-canal.jpg"
      },
      {
        id: 2,
        question: "San Rafael is in which County?",
        options: ["Alameda", "Sonoma", "Marin"],
        correctAnswer: "Marin",
        image: "/san-rafael-canal.jpg"
      },
      {
        id: 3,
        question: "What is this location?",
        options: ["Northgate", "Mission San Rafael", "Brete Harte"],
        correctAnswer: "Mission San Rafael",
        image: "/san-rafael-canal.jpg"
      }
    ];
  
    // Quiz progression
    let currentQuestionIndex = 0;
    let selectedAnswer: string | null = null;
    let isAnswerSubmitted = false;
    let isAnswerCorrect = false;
    let quizCompleted = false;
    let numberOfCorrectAnswers = 0;
  
    $: currentQuestion = questions[currentQuestionIndex];
    $: progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    $: progressText = `Q. ${currentQuestionIndex + 1} of ${questions.length}`;
  
    // Quiz levels
    const levels = [
      { id: 1, number: 1, title: "San Rafael Location", status: "current" },
      { id: 2, number: 2, title: "San Rafael History, Demographics & Civic Basics", status: "upcoming" },
      { id: 3, number: 3, title: "Who Cares?", status: "upcoming" },
      { id: 4, number: 4, title: "Planning Process", status: "upcoming" },
      { id: 5, number: 5, title: "Development Codes & Legal Requirements", status: "upcoming" },
      { id: 6, number: 6, title: "Cities, State Mandates, and What We Can Still Control", status: "upcoming" },
      { id: 7, number: 7, title: "California Housing & Development Laws Quiz", status: "upcoming" },
      { id: 8, number: 8, title: "Housing Affordability & Economic Impact", status: "upcoming" },
      { id: 9, number: 9, title: "Infrastructure & City Services Quiz", status: "upcoming" },
      { id: 10, number: 10, title: "Advanced Scenarios", status: "upcoming" }
    ];
  
    // User status
    const userStatus = {
      votes: 1,
      knowledge: 1,
      status: "Votist"
    };
  
    function selectAnswer(option: string) {
      if (!isAnswerSubmitted) {
        selectedAnswer = option;
      }
    }
  
    function submitAnswer() {
      if (selectedAnswer) {
        isAnswerSubmitted = true;
        isAnswerCorrect = selectedAnswer === currentQuestion.correctAnswer;
        
        if (isAnswerCorrect) {
          numberOfCorrectAnswers++;
        }
      }
    }
  
    function nextQuestion() {
      selectedAnswer = null;
      isAnswerSubmitted = false;
      isAnswerCorrect = false;
  
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
      } else {
        quizCompleted = true;
      }
    }
  
    function skipQuestion() {
      selectedAnswer = null;
      isAnswerSubmitted = false;
      isAnswerCorrect = false;
  
      if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
      } else {
        quizCompleted = true;
      }
    }
  
    function restartQuiz() {
      currentQuestionIndex = 0;
      selectedAnswer = null;
      isAnswerSubmitted = false;
      isAnswerCorrect = false;
      quizCompleted = false;
      numberOfCorrectAnswers = 0;
    }
  </script>
  
  <div class="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md my-8">
    {#if !quizCompleted}
      <!-- Quiz Header -->
      {#if currentQuestionIndex === 0 && !isAnswerSubmitted}
        <div class="text-center mb-8">
          <h1 class="text-teal-700 text-xl font-medium mb-2">Knowledge is Power</h1>
          <div class="mt-8">
            <h2 class="text-teal-700 text-xl font-medium">Level 01</h2>
            <h3 class="text-teal-700 text-2xl font-bold">San Rafael, Location</h3>
            
            <button 
              class="mt-4 px-8 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150"
              on:click={() => isAnswerSubmitted = false}
            >
              Start
            </button>
          </div>
          
          <div class="mt-8 p-4 rounded-lg border border-gray-200 inline-block text-left">
            <p class="text-lg font-medium">4 Questions</p>
            <div class="flex items-center mt-4">
              <div class="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="ml-2 text-lg">+1</span>
              <span class="ml-2 text-lg text-teal-700">Vote</span>
            </div>
            <div class="flex items-center mt-2">
              <div class="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                <span class="font-bold">K</span>
              </div>
              <span class="ml-2 text-lg">+1</span>
              <span class="ml-2 text-lg text-teal-700">Knowledge</span>
              <div class="ml-4 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                <span class="font-bold">S</span>
              </div>
              <span class="ml-2 text-lg text-gray-400">Status = <span class="text-teal-700">Votist</span></span>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Question Content -->
      {#if isAnswerSubmitted || currentQuestionIndex > 0}
        <div class="mb-8">
          <!-- svelte-ignore a11y_img_redundant_alt -->
          <img 
            src={currentQuestion.image} 
            alt="Quiz question image" 
            class="w-full h-64 object-cover rounded-md mb-4"
          />
          
          <h3 class="text-teal-700 text-2xl font-bold text-center mb-6">{currentQuestion.question}</h3>
          
          <div class="space-y-4">
            {#each currentQuestion.options as option}
              <button 
                class="w-full p-4 text-white font-medium rounded-md transition duration-150 text-center {selectedAnswer === option ? 'bg-teal-700' : 'bg-teal-600 hover:bg-teal-700'} {isAnswerSubmitted && option === currentQuestion.correctAnswer ? 'bg-green-600' : ''}"
                on:click={() => selectAnswer(option)}
                disabled={isAnswerSubmitted}
              >
                {option}
                {#if isAnswerSubmitted && option === currentQuestion.correctAnswer}
                  <span class="ml-2 text-yellow-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Correct!
                  </span>
                {/if}
              </button>
            {/each}
          </div>
          
          <!-- Answer Feedback -->
          {#if isAnswerSubmitted}
            {#if isAnswerCorrect}
              <div class="mt-4 text-center">
                <p class="text-green-600 text-xl">
                  <span class="inline-block w-8 h-8 rounded-full bg-yellow-500 text-white text-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                    </svg>
                  </span>
                  Correct!
                </p>
              </div>
            {:else}
              <div class="mt-4 text-center">
                <p class="text-teal-600 text-xl">Good try. This is the correct answer</p>
              </div>
            {/if}
          {:else if !selectedAnswer}
            <div class="mt-6 text-center">
              <button 
                class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150 mr-4"
                on:click={submitAnswer}
                disabled={!selectedAnswer}
              >
                Submit
              </button>
              
              <button 
                class="px-6 py-2 bg-white text-teal-700 border border-teal-700 rounded-md shadow-sm hover:bg-gray-50 transition duration-150"
                on:click={skipQuestion}
              >
                Skip
              </button>
            </div>
          {/if}
          
          <!-- Navigation -->
          <div class="mt-6 text-right">
            {#if isAnswerSubmitted}
              <button 
                class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150"
                on:click={nextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
              </button>
            {/if}
          </div>
          
          <!-- Progress -->
          <div class="mt-4 flex justify-between items-center text-gray-500">
            <div>{progressText}</div>
            {#if !isAnswerSubmitted}
              <button 
                class="text-teal-700 hover:underline"
                on:click={skipQuestion}
              >
                Skip
              </button>
            {/if}
          </div>
        </div>
      {/if}
    {:else}
      <!-- Quiz Completed Screen -->
      <div class="text-center py-8">
        <h2 class="text-teal-700 text-2xl font-bold mb-4">Completed! San Rafael, CA: Location</h2>
        
        <div class="flex justify-center space-x-8 mb-8">
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
              </svg>
            </div>
            <span class="ml-2 text-lg">+1</span>
            <span class="ml-2 text-lg">Vote</span>
          </div>
  
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white">
              <span class="font-bold">K</span>
            </div>
            <span class="ml-2 text-lg">+1</span>
            <span class="ml-2 text-lg">Knowledge</span>
          </div>
  
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
              <span class="font-bold">S</span>
            </div>
            <span class="ml-2 text-lg text-gray-400">Status = <span class="text-teal-700">Votist</span></span>
          </div>
        </div>
        
        <div class="flex justify-center space-x-4 mb-8">
          <button class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150 flex items-center">
            <div class="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
              </svg>
            </div>
            Vote
          </button>
          <div class="text-2xl text-yellow-500 font-bold">Vote Now</div>
        </div>
        
        <div class="flex justify-center space-x-4">
          <button 
            class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150"
            on:click={restartQuiz}
          >
            Next Quiz
          </button>
          <div class="text-2xl text-teal-700">
            Or, keep going to get more voting power.
          </div>
        </div>
      </div>
    {/if}
  
    <!-- Only show levels on main screen -->
    {#if currentQuestionIndex === 0 && !isAnswerSubmitted}
      <div class="mt-12 flex">
        <div class="w-1/3">
          <h3 class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-teal-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Levels
          </h3>
          <span class="text-sm text-gray-500">(Gain Votes and Powers)</span>
          
          <div class="mt-4 relative border-l-4 border-teal-700 pl-6 pb-4">
            <div class="absolute left-0 top-0 w-8 h-8 -ml-4 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold">
              1
            </div>
            <p class="text-sm font-medium">San Rafael Location</p>
          </div>
          
          <div class="relative border-l-4 border-teal-700 pl-6 pb-4">
            <div class="absolute left-0 top-0 w-8 h-8 -ml-4 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold">
              2
            </div>
            <p class="text-sm font-medium">San Rafael History, Demographics & Civic Basics</p>
          </div>
          
          <div class="relative border-l-4 border-teal-700 pl-6 pb-4">
            <div class="absolute left-0 top-0 w-8 h-8 -ml-4 rounded-full bg-teal-700 flex items-center justify-center text-white font-bold">
              3
            </div>
            <p class="text-sm font-medium">Who Cares?</p>
          </div>
          
          <div class="relative border-l-4 border-gray-300 pl-6 pb-4">
            <div class="absolute left-0 top-0 w-8 h-8 -ml-4 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
              4
            </div>
            <p class="text-sm font-medium">Planning Process</p>
          </div>
          
          <div class="relative border-l-4 border-gray-300 pl-6 pb-4">
            <div class="absolute left-0 top-0 w-8 h-8 -ml-4 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
              5
            </div>
            <p class="text-sm font-medium">Development Codes & Legal Requirements</p>
          </div>
          
          <div class="relative border-l-4 border-gray-300 pl-6 pb-4">
            <div class="absolute left-0 top-0 w-8 h-8 -ml-4 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
              6
            </div>
            <p class="text-sm font-medium">Cities, State Mandates, and What We Can Still Control</p>
          </div>
        </div>
        
        <div class="w-2/3 px-6">
          <h2 class="text-2xl font-bold text-teal-700 mb-4">On Votist, knowledge is power —your power.</h2>
          <p class="text-gray-700 mb-4">
            Our Votist Levels ensure that every discussion is led by informed voices, not just the loudest ones. By completing these quizzes, you're not just proving what you know; you're securing your place in a community where credibility is earned. This process ensures that every vote, proposal, and conversation is built on a foundation of real understanding, so meaningful solutions—not misinformation or empty rhetoric—rise to the top.
          </p>
        </div>
      </div>
    {/if}
  
    <!-- Failed Attempt Screen -->
    {#if false}
      <div class="text-center py-8">
        <div class="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 class="text-2xl font-medium text-gray-600">Good effort</h3>
        <p class="text-teal-600 mb-8">Learn more about this topic in the Research Tab</p>
        
        <h2 class="text-4xl font-bold text-teal-700 mb-4">Try again!</h2>
        
        <button 
          class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150"
          on:click={restartQuiz}
        >
          Start
        </button>
        <span class="ml-4 text-2xl text-teal-700">San Rafael, Location</span>
      </div>
    {/if}
  </div>