<script lang="ts">
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let errorMessage = '';
	let isLoading = false;

	// Form validation schema
	const loginSchema = z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters')
	});

	async function handleLogin() {
		errorMessage = '';
		try {
			loginSchema.parse({ email, password });
			isLoading = true;
			const res = await fetch('/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			});
			const data = await res.json();
			if (res.ok && data.success) {
				goto('/dashboard');
			} else {
				errorMessage = data.message || 'Login failed. Please check your credentials.';
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				errorMessage = error.errors[0].message;
			} else {
				errorMessage = 'An unexpected error occurred. Please try again.';
				console.error(error);
			}
		} finally {
			isLoading = false;
		}
	}

	function handleForgotPassword() {
		goto('/auth/forgot-password');
	}
</script>

<div>
	<h1 class="mb-6 text-3xl font-bold">Login Details</h1>

	{#if errorMessage}
		<div
			class="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
			role="alert"
		>
			{errorMessage}
		</div>
	{/if}

	<div class="mb-4">
		<label for="email" class="mb-2 block text-gray-700">Email</label>
		<input
			id="email"
			type="email"
			bind:value={email}
			placeholder="Enter your email address"
			class="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
			autocomplete="email"
		/>
	</div>

	<div class="mb-4">
		<label for="password" class="mb-2 block text-gray-700">Password</label>
		<input
			id="password"
			type="password"
			bind:value={password}
			placeholder="Choose a password"
			class="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
			autocomplete="current-password"
		/>
		<button
			type="button"
			on:click={handleForgotPassword}
			class="mt-2 text-sm text-teal-600 hover:underline"
		>
			Forgot Password?
		</button>
	</div>

	<div class="mb-6 text-xs text-gray-600">
		By creating an account you agree to the <a href="/terms" class="text-teal-600"
			>Terms of Service</a
		>
		and <a href="/privacy" class="text-teal-600">Privacy Policy</a>
	</div>

	<div class="flex justify-end">
		<button
			on:click={handleLogin}
			class="rounded bg-teal-600 px-6 py-2 text-white shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] transition hover:bg-teal-500"
			disabled={isLoading}
		>
			{isLoading ? 'Logging in...' : 'Login'}
		</button>
	</div>

	<div class="mt-8 border-t border-gray-200 pt-6 text-center">
		<p>Don't have an account? <a href="/auth/register/name" class="text-teal-600">Sign Up</a></p>
	</div>
</div>
