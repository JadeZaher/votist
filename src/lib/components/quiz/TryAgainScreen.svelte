<script lang="ts">
    import { resetQuiz, goToPage } from '../../../stores/quizStore';
    
    function handleTryAgain() {
      resetQuiz();
      goToPage('start');
    }
  </script>
  
  <div class="bg-white rounded-lg shadow-md p-6">
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
        on:click={handleTryAgain}
      >
        Start
      </button>
      <span class="ml-4 text-2xl text-teal-700">San Rafael, Location</span>
    </div>
  </div>