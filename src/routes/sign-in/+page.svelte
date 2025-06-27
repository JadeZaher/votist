<script lang="ts">
	import { SignedIn, SignedOut } from 'svelte-clerk';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

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

<div class="bg-base-200 flex min-h-screen items-center justify-center">
	<SignedOut>
		<div class="card bg-base-100 w-96 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-6 justify-center text-center">Sign In</h2>

				<form on:submit|preventDefault={handleSignIn} class="space-y-4">
					<div class="form-control">
						<label class="label" for="identifier">
							<span class="label-text">Email or Username</span>
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
						<label class="label" for="password">
							<span class="label-text">Password</span>
						</label>
						<input
							id="password"
							type="password"
							placeholder="Enter your password"
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
								Signing in...
							{:else}
								Sign In
							{/if}
						</button>
					</div>
				</form>

				<div class="divider">OR</div>

				<div class="text-center">
					<p class="text-sm">
						Don't have an account?
						<a href="/sign-up" class="link link-primary">Sign up</a>
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
