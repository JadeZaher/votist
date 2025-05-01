<script lang="ts">
  import {
    goToPage,
    levels,
    currentLevel,
    userStatus,
  } from "../../../stores/quizStore";
  import LevelsList from "./LevelsList.svelte";
  import voteIco from "$lib/assets/quiz/Isolation_Mode.svg";
  import knowledgeIco from "$lib/assets/quiz/Knowlege Icon.svg";
  import discussIco from "$lib/assets/quiz/Group 8.svg";
  import statusIco from "$lib/assets/quiz/Status Icon.svg";

  const startQuiz = () => {
    goToPage("question");
  };
</script>

<div class="bg-white rounded-xl shadow-md p-12">
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

    <div
      class="mt-8 px-12 w-1/3 py-8 rounded-lg inline-block text-left shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
    >
      <p class="text-3xl font-medium text-yellow-500 text-center">
        4 Questions
      </p>
      <div class="flex items-center mt-4 w-full">
        <div class="flex w-1/2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white"
          >
            <img src={voteIco} alt="vote" class="w-full" />
          </div>
          <span class="ml-2 text-xl text-teal-700 font-bold">+1</span>
          <span class="ml-2 text-xl font-bold text-teal-700">Vote</span>
        </div>
        <div class="flex w-1/2">
          <div class="ml-4 w-8 h-8 flex items-center justify-center text-white">
            <img src={discussIco} alt="discussion" class="w-full" />
          </div>
          <span class="text-xl font-bold text-teal-700 ml-3"
            >Join the discussion</span
          >
        </div>
      </div>
      <div class="flex items-center mt-8 w-full">
        <div class="flex w-1/2">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center text-white "
          >
            <img src={knowledgeIco} alt="knowledge" class="w-full" />
          </div>
          <span class="ml-2 text-xl font-bold text-teal-700">+1</span>
          <span class="ml-2 text-xl font-bold text-teal-700">Knowledge</span>
        </div>
        <div class="flex w-1/2">
          <div
            class="ml-4 w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white"
          >
            <img src={statusIco} alt="status" class="w-full" />
          </div>
          <span class="ml-2 text-lg font-bold text-teal-700 "
            >Status = <span class="text-teal-700">Votist</span></span
          >
        </div>
      </div>
    </div>
  </div>

  <div class="mt-12 flex px-20">
    <div class="w-1/2">
      <LevelsList />
    </div>

    <div class="w-1/2 px-20">
      <h2 class="text-3xl font-bold text-teal-700 mb-4">
        On Votist, knowledge is power —your power.
      </h2>
      <p class="text-gray-700 mb-4">
        Our Votist Levels ensure that every discussion is led by informed
        voices, not just the loudest ones. By completing these quizzes, you're
        not just proving what you know; you're securing your place in a
        community where credibility is earned. This process ensures that every
        vote, proposal, and conversation is built on a foundation of real
        understanding, so meaningful solutions—not misinformation or empty
        rhetoric—rise to the top.
      </p>
    </div>
  </div>
</div>
