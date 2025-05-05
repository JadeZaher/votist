<script lang="ts">
	import { goto } from '$app/navigation';
	import { signUp } from '$lib/clerk';
	import { z } from 'zod';

	let phone = '';
	let errorMessage = '';
	let isVerifying = false;

	// Validation schema for phone number
	const phoneSchema = z.string()
		.regex(/^\+?1?\d{10,14}$/, 'Invalid phone number')
		.transform(val => val.replace(/\D/g, '')); // Remove non-digit characters

	async function handleVerification() {
		try {
			// Validate phone number
			const validatedPhone = phoneSchema.parse(phone);

			// Retrieve stored registration data
			const firstName = sessionStorage.getItem('registerFirstName') || '';
			const lastName = sessionStorage.getItem('registerLastName') || '';
			const email = sessionStorage.getItem('registerEmail') || '';
			const password = sessionStorage.getItem('registerPassword') || '';

			// Validate stored data
			if (!firstName || !lastName || !email || !password) {
				throw new Error('Registration data is incomplete');
			}

			// Set verifying state
			isVerifying = true;
			errorMessage = '';

			// Attempt sign up
			const result = await signUp({
				firstName,
				lastName,
				email,
				password,
				phoneNumber: `+1${validatedPhone}`
			});

			// Clear sensitive data
			['registerFirstName', 'registerLastName', 'registerEmail', 'registerPassword'].forEach(key => 
				sessionStorage.removeItem(key)
			);

			// Handle successful registration
			if (result.status === 'complete') {
				goto('/dashboard');
			} else {
				errorMessage = 'Registration could not be completed';
			}
		} catch (error) {
			// Handle validation or signup errors
			if (error instanceof z.ZodError) {
				errorMessage = error.errors[0].message;
			} else if (error instanceof Error) {
				errorMessage = error.message;
			} else {
				errorMessage = 'An unexpected error occurred';
			}
		} finally {
			isVerifying = false;
		}
	}

	function formatPhoneNumber(input: string) {
		// Auto-format phone number input
		const cleaned = input.replace(/\D/g, '');
		let formatted = cleaned;

		// Apply formatting for US phone numbers
		if (formatted.length > 3) {
			formatted = `(${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6, 10)}`;
		} else if (formatted.length > 0) {
			formatted = `(${formatted}`;
		}

		return formatted;
	}

	function handlePhoneInput() {
		phone = formatPhoneNumber(phone);
	}
</script>

<div>
	<h1 class="text-3xl font-bold mb-6">Phone Verification</h1>
	
	{#if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
			{errorMessage}
		</div>
	{/if}
	
	<div class="mb-4">
		<label for="phone" class="block text-gray-700 mb-2">Phone Number</label>
		<input 
			id="phone"
			type="tel" 
			bind:value={phone}
			on:input={handlePhoneInput}
			placeholder="(XXX) XXX-XXXX"
			maxlength="14"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
		<p class="text-xs text-gray-600 mt-2">We'll send a verification code to this number</p>
	</div>
	
	<div class="mb-6">
		<div class="flex items-center">
			<input 
				type="checkbox" 
				id="terms"
				class="mr-2"
				required
			/>
			<label for="terms" class="text-sm">
				I agree to receive SMS verification
			</label>
		</div>
	</div>
	
	<div class="flex justify-end">
		<button 
			on:click={handleVerification}
			disabled={isVerifying}
			class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] disabled:opacity-50"
		>
			{#if isVerifying}
				Verifying...
			{:else}
				Complete Registration
			{/if}
		</button>
	</div>
	
	<div class="border-t border-gray-200 mt-8 pt-6 text-center">
		<p>Already have an account? <a href="/auth/login" class="text-teal-600">Sign In</a></p>
	</div>
</div>