<!-- <script lang="ts">
	import { goto } from '$app/navigation';
	import { z } from 'zod';

	let firstName = '';
	let lastName = '';
	let pseudonym = '';
	let errorMessage = '';

	// Validation schema
	const nameSchema = z.object({
		firstName: z.string().min(2, 'First name must be at least 2 characters'),
		lastName: z.string().min(2, 'Last name must be at least 2 characters')
	});

	function handleNext() {
		try {
			// Validate inputs
			nameSchema.parse({ firstName, lastName });

			// Store data for next steps
			sessionStorage.setItem('registerFirstName', firstName);
			sessionStorage.setItem('registerLastName', lastName);
			if (pseudonym) {
				sessionStorage.setItem('registerPseudonym', pseudonym);
			}

			// Move to next registration step
			goto('/auth/register/email');
		} catch (error) {
			if (error instanceof z.ZodError) {
				errorMessage = error.errors[0].message;
			}
		}
	}

	function handleWhyClick() {
		alert("Real names are required to maintain the integrity of our platform and ensure authentic civic discourse.");
	}
</script>

<div>
	<h1 class="text-3xl font-bold mb-6">Your First and Last Name</h1>
	
	{#if errorMessage}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
			{errorMessage}
		</div>
	{/if}
	
	<div class="flex items-center mb-8">
		<span class="text-lg">Votist requires real names.</span>
		<button on:click={handleWhyClick} class="ml-1 text-lg text-blue-500 underline">Why?</button>
	</div>
	
	<div class="mb-8">
		<label for="firstName" class="block text-gray-700 mb-2">First Name</label>
		<input 
			id="firstName"
			type="text" 
			bind:value={firstName}
			placeholder="First name"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-8">
		<label for="lastName" class="block text-gray-700 mb-2">Last Name</label>
		<input 
			id="lastName"
			type="text" 
			bind:value={lastName}
			placeholder="Last name"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
	</div>
	
	<div class="mb-6">
		<label for="pseudonym" class="block text-gray-700 mb-2">A Pseudonym for Non-Members</label>
		<input 
			id="pseudonym"
			type="text" 
			bind:value={pseudonym}
			placeholder="Pseudonym (optional)"
			class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
		/>
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
