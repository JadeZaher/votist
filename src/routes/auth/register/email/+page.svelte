<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let birthDate = '';
	let errorMessage = '';

	// Validation schema
	const registrationSchema = z.object({
		email: z.string().email('Invalid email address'),
		password: z.string().min(8, 'Password must be at least 8 characters'),
		confirmPassword: z.string(),
		birthDate: z.string().refine(value => {
			// Basic date validation
			const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
			if (!dateRegex.test(value)) return false;
			
			const [month, day, year] = value.split('/').map(Number);
			const birthDateObj = new Date(year, month - 1, day);
			const age = new Date().getFullYear() - birthDateObj.getFullYear();
			
			return age >= 13; // Minimum age requirement
		}, { message: 'Invalid date or under 13 years old' })
	}).refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

	function handleNext() {
		try {
			// Validate inputs
			registrationSchema.parse({ 
				email, 
				password, 
				confirmPassword,
				birthDate 
			});

			// Store data for next steps
			sessionStorage.setItem('registerEmail', email);
			sessionStorage.setItem('registerPassword', password);
			sessionStorage.setItem('registerBirthDate', birthDate);

			// Move to verification step
			goto('/auth/register/verify');
		} catch (error) {
			if (error instanceof z.ZodError) {
				errorMessage = error.errors[0].message;
			} else {
				errorMessage = 'An unexpected error occurred';
			}
		}
	}

	function formatBirthDate(input: string) {
		// Auto-format birth date input
		const cleaned = input.replace(/\D/g, '');
		if (cleaned.length >= 2) {
			input = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
		}
		if (cleaned.length >= 4) {
			input = input.slice(0, 5) + '/' + cleaned.slice(4);
		}
		return input.slice(0, 10);
	}

	function handleBirthDateInput() {
		birthDate = formatBirthDate(birthDate);
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
			placeholder="Choose a password"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-4">
		<label for="confirmPassword" class="block text-gray-700 mb-2">Confirm Password</label>
		<input 
			id="confirmPassword"
			type="password" 
			bind:value={confirmPassword}
			placeholder="Confirm your password"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-6">
		<label for="birthDate" class="block text-gray-700 mb-2">Your Birth Date</label>
		<input 
			id="birthDate"
			type="text" 
			bind:value={birthDate}
			on:input={handleBirthDateInput}
			placeholder="MM/DD/YYYY"
			maxlength="10"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="text-xs text-gray-600 mb-6">
		By creating an account you agree to the <a href="/terms" class="text-teal-600">Terms of Service</a> and <a href="/privacy" class="text-teal-600">Privacy Policy</a>
	</div>
	
	<div class="flex justify-end">
		<button 
			on:click={handleNext}
			class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
		>
			Next
		</button>
	</div>
</div> -->
