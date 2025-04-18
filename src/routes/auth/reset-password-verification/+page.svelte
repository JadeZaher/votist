<script lang="ts">
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	let resetCode = '';
	let newPassword = '';
	let confirmPassword = '';
	let email = '';
	let errorMessage = '';
	let successMessage = '';
	let isLoading = false;

	// Validation schema
	const resetSchema = z.object({
		email: z.string().email('Invalid email address'),
		resetCode: z.string().min(6, 'Reset code must be at least 6 characters'),
		newPassword: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string()
	}).refine(data => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

	async function handleResetPassword() {
		// Reset previous messages
		errorMessage = '';
		successMessage = '';
		
		try {
			// Validate inputs
			resetSchema.parse({
				email,
				resetCode,
				newPassword,
				confirmPassword
			});

			// Set loading state
			isLoading = true;

			if (!window.Clerk?.client) {
				throw new Error('Clerk not initialized');
			}

			// First, create a password reset attempt
			const resetAttempt = await window.Clerk.client.signIn.create({
				identifier: email
			});

			// Prepare the password reset
			await resetAttempt.prepareFirstFactor({
				strategy: 'reset_password_email_code',
				emailAddressId: resetAttempt.identifier || ''
			});

			// Attempt to reset the password
			await resetAttempt.attemptFirstFactor({
				strategy: 'reset_password_email_code',
				code: resetCode,
				password: newPassword
			});

			// Handle successful reset
			successMessage = 'Password reset successfully';
			
			// Redirect to login after a short delay
			setTimeout(() => {
				goto('/auth/login');
			}, 2000);
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
	<h1 class="text-3xl font-bold mb-6">Reset Password</h1>
	
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
		<label for="email" class="block text-gray-700 mb-2">Email</label>
		<input 
			id="email"
			type="email" 
			bind:value={email}
			placeholder="Enter your email address"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-4">
		<label for="resetCode" class="block text-gray-700 mb-2">Reset Code</label>
		<input 
			id="resetCode"
			type="text" 
			bind:value={resetCode}
			placeholder="Enter the reset code sent to your email"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-4">
		<label for="newPassword" class="block text-gray-700 mb-2">New Password</label>
		<input 
			id="newPassword"
			type="password" 
			bind:value={newPassword}
			placeholder="Enter new password"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-4">
		<label for="confirmPassword" class="block text-gray-700 mb-2">Confirm New Password</label>
		<input 
			id="confirmPassword"
			type="password" 
			bind:value={confirmPassword}
			placeholder="Confirm new password"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
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
				Resetting Password...
			{:else}
				Reset Password
			{/if}
		</button>
	</div>
</div>