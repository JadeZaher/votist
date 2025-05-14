<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn } from '$lib/clerk';
	import { z } from 'zod';

	let email = '';
	let password = '';
	let errorMessage = '';

	// Form validation schema
	const loginSchema = z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters')
	});

	async function handleLogin() {
		try {
			// Validate inputs
			loginSchema.parse({ email, password });

			// Attempt sign in
			const result = await signIn({ email, password });
			
			if (result.status === 'complete') {
				goto('/dashboard');
			} else {
				errorMessage = 'Login failed. Please check your credentials.';
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				errorMessage = error.errors[0].message;
			} else {
				errorMessage = 'An unexpected error occurred. Please try again.';
				console.error(error);
			}
		}
	}

	function handleForgotPassword() {
		goto('/auth/forgot-password');
	}
</script>

<div>
	<h1 class="text-3xl font-bold mb-6">Login Details</h1>
	
	{#if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
			{errorMessage}
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
		<label for="password" class="block text-gray-700 mb-2">Password</label>
		<input 
			id="password"
			type="password" 
			bind:value={password}
			placeholder="Enter your password"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
		<button 
			on:click={handleForgotPassword}
			class="text-sm text-teal-600 hover:underline mt-2"
		>
			Forgot Password?
		</button>
	</div>
	
	<div class="text-xs text-gray-600 mb-6">
		By logging in, you agree to the <a href="/terms" class="text-teal-600">Terms of Service</a> and <a href="/privacy" class="text-teal-600">Privacy Policy</a>
	</div>
	
	<div class="flex justify-end">
		<button 
			on:click={handleLogin}
			class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
		>
			Login
		</button>
	</div>
	
	<div class="border-t border-gray-200 mt-8 pt-6 text-center">
		<p>Don't have an account? <a href="/auth/register/name" class="text-teal-600">Sign Up</a></p>
	</div>
</div> -->
