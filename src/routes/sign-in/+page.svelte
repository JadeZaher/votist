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
				goto('/');
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
		<div class="flex h-[40vh] md:h-full items-center justify-center bg-[#167B9B] p-8">
			<img src={logo} alt="VOTIST" class="h-20 md:h-24 object-contain" />
		</div>

		<!-- Right Column (Form) -->
		<div class="flex h-full items-center justify-start bg-white px-4 md:px-0">
			<div class="w-full px-4 md:max-w-lg md:pl-20 md:pr-6 space-y-8 py-6 pb-24">
				<h2 class="text-2xl md:text-3xl font-bold text-[#1E1E1E]">Sign In</h2>

				<form on:submit|preventDefault={handleSignIn} class="space-y-6">
					<div class="space-y-4">
						<!-- Identifier -->
						<div class="form-control flex flex-col gap-1">
							<label for="identifier" class="label mb-1">
								<span class="label-text text-base text-[#1E1E1E] font-medium">Email or Username</span>
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
								<span class="label-text text-base text-[#1E1E1E] font-medium">Password</span>
							</label>
							<input
								id="password"
								type="password"
								placeholder="Enter your password"
								class="input input-bordered w-full py-3 text-base border-[#949494] focus:border-[#167B9B] focus:ring-1 focus:ring-[#167B9B]"
								bind:value={password}
								disabled={loading}
								required
							/>
						</div>
					</div>

					<!-- Error Message -->
					{#if error}
						<div class="alert bg-red-100 border-red-200 p-3 rounded-lg">
							<span class="text-red-800 font-medium">{error}</span>
						</div>
					{/if}

					<!-- Footer -->
					<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
						<div class="text-[#6B7280]">
							<div class="flex items-center flex-wrap gap-1 text-sm">
								<span>Don't have an account?</span>
								<a href="/sign-up" class="font-semibold text-[#167B9B] hover:text-[#155E75]">Sign up</a>
							</div>
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							class="btn bg-[#167B9B] hover:bg-[#155E75] text-white font-medium px-8 py-3 text-base md:text-lg w-full md:w-auto text-center"
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
