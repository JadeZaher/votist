<script context="module" lang="ts">
	declare const Clerk: import('@clerk/clerk-js').Clerk;
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	let isMenuOpen = false;
</script>

<header class="bg-white shadow-sm">
	<div class="mx-auto px-4 py-3 sm:px-6 lg:px-8">
		<div class="flex items-center justify-between">
			<!-- Mobile menu button -->
			<button
				class="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
				on:click={() => (isMenuOpen = !isMenuOpen)}
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			<!-- Title -->
			<h1 class="flex-1 text-center text-xl font-semibold text-gray-900">San Rafael Project</h1>

			<!-- Sign out -->
			<div class="flex items-center">
				{#if browser && Clerk.user}
					<button
						on:click|preventDefault={() => goto('/sign-out')}
						class="flex items-center rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
					>
						Sign out
					</button>
				{/if}
			</div>
		</div>
	</div>
</header>
