<script lang="ts">
  import QuizProgressBar from "$lib/components/QuizProgressBar.svelte";
	let { children } = $props();
</script>

{@render children()}

