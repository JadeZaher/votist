<script lang="ts">
    import { goToPage, levels, currentLevel, userStatus } from '../../../stores/quizStore';
    import LevelsList from './LevelsList.svelte';
    
    const startQuiz = () => {
      goToPage('question');
    };
  </script>
  
  <div class="bg-white rounded-xl shadow-md p-12 ">
    <div class="text-center mb-12 shadow-md pb-32">
      <h1 class="text-teal-700 text-2xl font-medium">Knowledge is Power</h1>
      
      <div class="mt-24">
        <h2 class="text-teal-700 text-4xl font-medium">Level 01</h2>
        <h3 class="text-teal-700 text-5xl font-bold">San Rafael, Location</h3>
        
        <button 
          class="shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] text-xl font-bold mt-8 px-8 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-150"
          on:click={startQuiz}
        >
          Start
        </button>
      </div>
      
      <div class="mt-8 px-20 py-8 rounded-lg inline-block text-left shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]">
        <p class="text-3xl font-medium text-yellow-500 text-center">4 Questions</p>
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
  
    <div class="mt-12 flex px-20">
      <div class="w-1/2 ">
        <LevelsList />
      </div>
      
      <div class="w-1/2 px-20">
        <h2 class="text-3xl font-bold text-teal-700 mb-4">On Votist, knowledge is power —your power.</h2>
        <p class="text-gray-700 mb-4">
          Our Votist Levels ensure that every discussion is led by informed voices, not just the loudest ones. By completing these quizzes, you're not just proving what you know; you're securing your place in a community where credibility is earned. This process ensures that every vote, proposal, and conversation is built on a foundation of real understanding, so meaningful solutions—not misinformation or empty rhetoric—rise to the top.
        </p>
      </div>
    </div>
  </div>