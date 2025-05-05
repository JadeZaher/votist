<script lang="ts">
    import { resetQuiz, goToPage } from '../../../stores/quizStore';
    
    function handleVoteClick() {
      goToPage('tryAgain');
    }
    
    function handleNextQuizClick() {
      goToPage('tryAgain');
    }
  </script>
  
  <div class="bg-white rounded-lg shadow-md p-12 justify-center w-2/3 align-middle text-center mx-auto">
    <div class="text-center py-8">
      <h2 class="text-teal-700 text-5xl font-bold mb-14">Completed! San Rafael, CA: Location</h2>
      
      <div class="flex justify-center space-x-8 mb-20 text-teal-700 text-3xl font-bold">
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
      
      <div class="flex justify-left space-x-4 mb-8 font-bold px-40">
        <button 
          class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150 flex items-center"
          on:click={handleVoteClick}
        >
          <div class="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
            </svg>
          </div>
          Vote
        </button>
        <div class="text-2xl text-yellow-500 font-bold">Vote Now</div>
      </div>
      
      <div class="flex justify-left space-x-4 font-bold px-40">
        <button 
          class="px-6 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 transition duration-150"
          on:click={handleNextQuizClick}
        >
          Next Quiz
        </button>
        <div class="text-2xl text-teal-700">
          Or, keep going to get more voting power.
        </div>
      </div>
    </div>
  </div>