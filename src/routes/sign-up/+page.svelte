<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import logo from '$lib/assets/logo/logo-white.png';
	import { handleSocialAuth } from './social-auth';

	let loading = false;

	onMount(async () => {
		if (browser) {
			const clerk = (window as any).Clerk;
			if (clerk && (await clerk.loaded)) {
				if (clerk.user) {
					window.location.href = '/';
				}
			}
		}
	});
</script>

<div class="grid min-h-screen w-screen grid-cols-1 md:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
	<!-- Left Column (Logo) -->
	<div class="flex h-[40vh] items-center justify-center bg-[#167B9B] p-8 md:h-full">
		<img src={logo} alt="VOTIST" class="h-20 object-contain md:h-24" />
	</div>

	<!-- Right Column -->
	<div class="flex h-full items-center justify-start bg-white px-4 md:px-0">
		<div class="w-full space-y-8 px-4 py-6 pb-24 md:max-w-lg md:pr-6 md:pl-20">
			<h2 class="text-2xl font-bold text-[#1E1E1E] md:text-3xl">Create Account</h2>

			<div class="space-y-6">
				<p class="text-sm text-gray-600">
					Create your Votist account using LinkedIn. Your real name will be imported from
					your LinkedIn profile.
				</p>

				<button
					type="button"
					class="btn btn-outline w-full"
					disabled={loading}
					on:click={() => {
						loading = true;
						handleSocialAuth('linkedin', true);
					}}
				>
					{#if loading}
						<span class="loading loading-spinner loading-sm"></span>
						Connecting...
					{:else}
						<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
							<path
								d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
							/>
						</svg>
						Sign up with LinkedIn
					{/if}
				</button>
			</div>

			<div class="text-sm text-[#6B7280]">
				Already have an account?
				<a href="/sign-in" class="font-semibold text-[#167B9B] hover:text-[#155E75]"
					>Sign in</a
				>
			</div>
		</div>
	</div>
</div>
