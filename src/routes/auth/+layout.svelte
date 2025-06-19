<!-- <script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { initClerk } from '$lib/clerk';
	import logo from '$lib/assets/logo/logo-white.png';

	onMount(async () => {
		await initClerk();
	});

	function getProgressSteps() {
		const path = $page.url.pathname;
		if (path.includes('/auth/login')) return 1;
		if (path.includes('/auth/register/name')) return 2;
		if (path.includes('/auth/register/verify')) return 3;
		return 0;
	}
</script>

<div class="flex min-h-screen fixed w-full h-full top-0 bg-white">
	<div class="w-1/3 bg-teal-700 flex items-center justify-center">
		<img src={logo} alt="Votist Logo" class="w-40" />
	</div>
	
	<div class="w-2/3 flex items-center justify-center">
		<div class="w-full max-w-md px-4">
			{#if getProgressSteps() > 0}
				<h2 class="text-xl font-medium mb-1">Step {getProgressSteps()} of 3</h2>
			{/if}
			
			<slot />
		</div>
	</div>
</div> -->
