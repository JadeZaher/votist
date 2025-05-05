<script lang="ts">
    import { currentPage } from '../../stores/quizStore';
    import StartScreen from '$lib/components/quiz/StartScreen.svelte';
    import QuestionScreen from '$lib/components/quiz/QuestionScreen.svelte';
    import FeedbackScreen from '$lib/components/quiz/FeedbackScreen.svelte';
    import CompletedScreen from '$lib/components/quiz/CompletedScreen.svelte';
    import TryAgainScreen from '$lib/components/quiz/TryAgainScreen.svelte';
  </script>
  
  <div class="flex w-full top-0 bg-white">
    {#if $currentPage === 'start'}
      <StartScreen />
    {:else if $currentPage === 'question'}
      <QuestionScreen />
    {:else if $currentPage === 'feedback'}
      <FeedbackScreen />
    {:else if $currentPage === 'completed'}
      <CompletedScreen />
    {:else if $currentPage === 'tryAgain'}
      <TryAgainScreen />
    {/if}
  </div>