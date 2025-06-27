<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let emailAddress = '';
	let password = '';
	let username = '';
	let loading = false;
	let error = '';

	// Redirect on mount if user is already authenticated
	onMount(async () => {
		const { isAuthenticated } = await fetch('/sign-up').then((res) => res.json());
		if (isAuthenticated) {
			goto('/');
		}
	});

	async function handleSignUp() {
		if (!emailAddress || !password || !username) {
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

			const signUpAttempt = await clerk.client.signUp.create({
				emailAddress,
				password,
				username
			});

			if (signUpAttempt.status === 'complete') {
				await clerk.setActive({ session: signUpAttempt.createdSessionId });
				goto('/');
			} else {
				error = 'Please check your email for verification';
			}
		} catch (err: any) {
			console.error('Sign up error:', err);
			error = err.errors?.[0]?.message || 'Sign up failed. Please try again.';
		} finally {
			loading = false;
		}
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSignUp();
		}
	}
</script>

<div class="bg-base-200 flex min-h-screen items-center justify-center">
	<SignedOut>
		<div class="card bg-base-100 w-96 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-6 justify-center text-center">Sign Up</h2>

				<form on:submit|preventDefault={handleSignUp} class="space-y-4">
					<div class="form-control">
						<label class="label" for="username">
							<span class="label-text">Username</span>
						</label>
						<input
							id="username"
							type="text"
							placeholder="Choose a username"
							class="input input-bordered w-full"
							bind:value={username}
							on:keypress={handleKeyPress}
							disabled={loading}
							required
						/>
					</div>

					<div class="form-control">
						<label class="label" for="email">
							<span class="label-text">Email</span>
						</label>
						<input
							id="email"
							type="email"
							placeholder="Enter your email"
							class="input input-bordered w-full"
							bind:value={emailAddress}
							on:keypress={handleKeyPress}
							disabled={loading}
							required
						/>
					</div>

					<div class="form-control">
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<input
							id="password"
							type="password"
							placeholder="Choose a password"
							class="input input-bordered w-full"
							bind:value={password}
							on:keypress={handleKeyPress}
							disabled={loading}
							required
						/>
					</div>

					{#if error}
						<div class="alert alert-error">
							<span>{error}</span>
						</div>
					{/if}

					<div class="form-control mt-6">
						<button type="submit" class="btn btn-primary w-full" disabled={loading}>
							{#if loading}
								<span class="loading loading-spinner loading-sm"></span>
								Creating account...
							{:else}
								Sign Up
							{/if}
						</button>
					</div>
				</form>

				<div class="divider">OR</div>

				<div class="text-center">
					<p class="text-sm">
						Already have an account?
						<a href="/sign-in" class="link link-primary">Sign in</a>
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
