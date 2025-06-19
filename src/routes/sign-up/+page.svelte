<script lang="ts">
	import { SignedIn, SignedOut, SignUpButton } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Redirect on mount if user is already authenticated
	onMount(async () => {
		const { isAuthenticated } = await fetch('/sign-up').then((res) => res.json());
		if (isAuthenticated) {
			goto('/');
		}
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="card bg-base-100 w-96 shadow-xl">
		<div class="card-body items-center text-center">
			<SignedOut>
				<h2 class="card-title">Sign Up</h2>
				<p class="mb-4">Create your account to get started</p>
				<SignUpButton routing="path" path="/sign-up" />
			</SignedOut>
			<SignedIn>
				<p class="text-lg">Redirecting...</p>
				<span class="loading loading-spinner loading-md"></span>
			</SignedIn>
		</div>
	</div>
</div>
