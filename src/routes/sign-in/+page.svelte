<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import logo from '$lib/assets/logo/logo-white.png';

	let identifier = '';
	let password = '';
	let loading = false;
	let error = '';

	onMount(async () => {
		const { isAuthenticated } = await fetch('/sign-in').then((res) => res.json());
		if (isAuthenticated) {
			goto('/');
		}
	});

	async function handleSignIn() {
		if (!identifier || !password) {
			error = 'Please fill in all fields';
			return;
		}

		if (!browser) return;

		loading = true;
		error = '';

		try {
			const clerk = (window as any).Clerk;

			if (!clerk) {
				error = 'Authentication service not available';
				loading = false;
				return;
			}

			const signInAttempt = await clerk.client.signIn.create({ identifier, password });

			if (signInAttempt.status === 'complete') {
				await clerk.setActive({ session: signInAttempt.createdSessionId });
				goto('/dashboard');
			} else {
				error = 'Sign in requires additional verification';
			}
		} catch (err: any) {
			console.error('Sign in error:', err);
			error = err.errors?.[0]?.message || 'Invalid credentials. Please try again.';
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSignIn();
		}
	}
</script>

<!-- Responsive Layout -->
<div class="grid min-h-screen w-screen grid-cols-1 md:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
	<SignedOut>
		<!-- Left Column (Logo) -->
		<div class="flex h-[40vh] items-center justify-center bg-[#167B9B] p-8 md:h-full">
			<img src={logo} alt="VOTIST" class="h-20 object-contain md:h-24" />
		</div>

		<!-- Right Column (Form) -->
		<div class="flex h-full items-center justify-start bg-white px-4 md:px-0">
			<div class="w-full space-y-8 px-4 py-6 pb-24 md:max-w-lg md:pr-6 md:pl-20">
				<h2 class="text-2xl font-bold text-[#1E1E1E] md:text-3xl">Sign In</h2>

				<form on:submit|preventDefault={handleSignIn} class="space-y-6">
					<div class="space-y-4">
						<!-- Identifier -->
						<div class="form-control flex flex-col gap-1">
							<label for="identifier" class="label mb-1">
								<span class="label-text text-base font-medium text-[#1E1E1E]"
									>Email or Username</span
								>
							</label>
							<input
								id="identifier"
								type="text"
								placeholder="Enter your email or username"
								class="input input-bordered w-full py-3 text-base"
								bind:value={identifier}
								disabled={loading}
								required
							/>
						</div>

						<!-- Password -->
						<div class="form-control flex flex-col gap-1">
							<label for="password" class="label mb-1">
								<span class="label-text text-base font-medium text-[#1E1E1E]">Password</span>
							</label>
							<input
								id="password"
								type="password"
								placeholder="Enter your password"
								class="input input-bordered w-full border-[#949494] py-3 text-base focus:border-[#167B9B] focus:ring-1 focus:ring-[#167B9B]"
								bind:value={password}
								disabled={loading}
								required
							/>
						</div>
					</div>

					<!-- Error Message -->
					{#if error}
						<div class="alert rounded-lg border-red-200 bg-red-100 p-3">
							<span class="font-medium text-red-800">{error}</span>
						</div>
					{/if}

					<!-- Footer -->
					<div
						class="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
					>
						<div class="text-[#6B7280]">
							<div class="flex flex-wrap items-center gap-1 text-sm">
								<span>Don't have an account?</span>
								<a href="/sign-up" class="font-semibold text-[#167B9B] hover:text-[#155E75]"
									>Sign up</a
								>
							</div>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							class="btn w-full bg-[#167B9B] px-8 py-3 text-center text-base font-medium text-white hover:bg-[#155E75] md:w-auto md:text-lg"
							disabled={loading}
						>
							{#if loading}
								<span class="loading loading-spinner loading-sm"></span>
								Signing in...
							{:else}
								Sign In
							{/if}
						</button>
					</div>
				</form>
			</div>
		</div>
	</SignedOut>

	<SignedIn>
		<div class="flex h-full w-full items-center justify-center">
			<div class="space-y-4 text-center">
				<p class="text-lg">Redirecting...</p>
				<span class="loading loading-spinner loading-md"></span>
			</div>
		</div>
	</SignedIn>
</div>
