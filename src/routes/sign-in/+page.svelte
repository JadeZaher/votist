<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import logo from '$lib/assets/logo/logo-header.png';

	let identifier = '';
	let password = '';
	let loading = false;
	let error = '';

	// Redirect on mount if user is already authenticated
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

			const signInAttempt = await clerk.client.signIn.create({
				identifier,
				password
			});

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

<div class="bg-base-200 flex h-screen items-center justify-center p-4">
	<SignedOut>
		<div class="card bg-base-100 w-full max-w-sm shadow-xl">
			<img src={logo} alt="VOTIST" class="h-14 mx-auto mb-6 mt-0 object-contain" />
			<div class="card-body space-y-4 pt-0 pb-4 px-4">
				<h2 class="text-3xl font-bold text-center text-[#1E1E1E] md:text-2xl mb-4">Sign In</h2>

				<form on:submit|preventDefault={handleSignIn} class="space-y-3">
					<div class="form-control">
						<label class="label pb-1" for="identifier">
							<span class="label-text text-sm text-[#1E1E1E]">Email or Username</span>
						</label>
						<input
							id="identifier"
							type="text"
							placeholder="Enter your email or username"
							class="input input-bordered w-full"
							bind:value={identifier}
							on:keypress={handleKeyPress}
							disabled={loading}
							required
						/>
					</div>

					<div class="form-control">
						<label class="label pb-1" for="password">
							<span class="label-text text-sm text-[#1E1E1E]">Password</span>
						</label>
						<input
							id="password"
							type="password"
							placeholder="Enter your password"
							class="input input-bordered w-full border-[#949494] focus:border-[#167B9B] focus:ring-1 focus:ring-[#167B9B]"
							bind:value={password}
							on:keypress={handleKeyPress}
							disabled={loading}
							required
						/>
					</div>

					{#if error}
						<div class="alert bg-red-100 border-red-200">
							<span class="text-red-800 font-medium">{error}</span>
						</div>
					{/if}

					<div class="form-control mt-4">
						<button 
							type="submit" 
							class="btn w-full bg-[#167B9B] hover:bg-[#155E75] text-white text-lg font-semibold border-none transition-colors"
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

					<div class="divider text-[#949494] before:bg-[#949494] after:bg-[#949494] my-2">OR</div>

					<div class="text-center pt-1">
						<p class="text-sm text-[#1E1E1E]">
							Don't have an account?
							<a href="/sign-up" class="text-[#167B9B] hover:text-[#155E75] font-medium transition-colors">Sign up</a>
						</p>
					</div>
			</div>
		</div>
	</SignedOut>

	<SignedIn>
		<div class="card bg-base-100 w-96 shadow-xl">
			<div class="card-body items-center text-center">
				<p class="text-lg">Redirecting...</p>
				<span class="loading loading-spinner loading-md"></span>
			</div>
		</div>
	</SignedIn>
</div>
