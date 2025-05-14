<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { z } from 'zod';
	import { resetPassword } from '$lib/clerk';

	let email = '';
	let errorMessage = '';
	let successMessage = '';
	let isLoading = false;

	// Email validation schema
	const emailSchema = z.string().email('Invalid email address');

	async function handleResetPassword() {
		// Reset previous messages
		errorMessage = '';
		successMessage = '';
		
		try {
			// Validate email
			emailSchema.parse(email);

			// Set loading state
			isLoading = true;

			// Attempt password reset
			await resetPassword(email);

			// Show success message
			successMessage = 'Password reset link sent. Check your email.';
		} catch (error) {
			// Handle validation or reset errors
			if (error instanceof z.ZodError) {
				errorMessage = error.errors[0].message;
			} else {
				errorMessage = error instanceof Error 
					? error.message 
					: 'An unexpected error occurred';
			}
		} finally {
			// Reset loading state
			isLoading = false;
		}
	}

	function handleBackToLogin() {
		goto('/auth/login');
	}
</script>

<div>
	<h1 class="text-3xl font-bold mb-6">Reset Your Password</h1>
	
	{#if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
			{errorMessage}
		</div>
	{/if}
	
	{#if successMessage}
		<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
			{successMessage}
		</div>
	{/if}
	
	<div class="mb-4">
		<label for="email" class="block text-gray-700 mb-2">Email Address</label>
		<input 
			id="email"
			type="email" 
			bind:value={email}
			placeholder="Enter your email address"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
		<p class="text-xs text-gray-600 mt-2">
			Enter the email associated with your account. We'll send a password reset link.
		</p>
	</div>
	
	<div class="flex justify-between items-center mt-6">
		<button 
			on:click={handleBackToLogin}
			class="text-teal-600 hover:underline"
		>
			Back to Login
		</button>
		
		<button 
			on:click={handleResetPassword}
			disabled={isLoading}
			class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] disabled:opacity-50"
		>
			{#if isLoading}
				Sending Reset Link...
			{:else}
				Reset Password
			{/if}
		</button>
	</div>
</div> -->
