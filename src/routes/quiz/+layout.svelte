<script lang="ts">
  import QuizProgressBar from "$lib/components/QuizProgressBar.svelte";
  let { children } = $props();
</script>

<div
  class="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50"
>
  <div class="w-full max-w-8xl px-4">
    {@render children()}
    <QuizProgressBar />
  </div>
</div>
