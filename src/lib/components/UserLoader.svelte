<script lang="ts">
	import { page } from '$app/stores';

	let initialized = $state(false);
	let error = $state<string | null>(null);

	$effect(() => {
		if ($page.data.user) {
			initialized = true;
		}
	});
</script>

{#if error}
	<div class="alert alert-error shadow-lg">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6 shrink-0 stroke-current"
			fill="none"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
		<span>{error}</span>
	</div>
{:else if !initialized}
	<div class="flex justify-center p-4">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else}
	<render></render>
{/if}
