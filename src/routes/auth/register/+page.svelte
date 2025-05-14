<!-- <script lang="ts">
	import logo from '$lib/assets/logo/logo-white.png';
	import { goto } from '$app/navigation';

	let firstName = '';
	let lastName = '';
	let pseudonym = '';

	const handleNext = () => {
		// Validate form fields
		if (!firstName || !lastName) {
			alert('Please enter your first and last name');
			return;
		}

		// Store entered data in session storage for now
		sessionStorage.setItem('registerFirstName', firstName);
		sessionStorage.setItem('registerLastName', lastName);
		if (pseudonym) {
			sessionStorage.setItem('registerPseudonym', pseudonym);
		}

		// Move to step 3
		goto('/auth/register/phone');
	};

	const handleWhyClick = () => {
		// Show explanation about why real names are required
		alert(
			'Real names are required for verification purposes and to maintain the integrity of the platform.'
		);
	};
</script> -->
<!-- 
<div class="fixed top-0 flex h-full min-h-screen w-full bg-white">
	<div class="flex w-1/3 items-center justify-center bg-teal-700">
		<img src={logo} alt="Votist Logo" class="w-40" />
	</div>

	<div class="flex w-2/3 items-center justify-center text-2xl">
		<div class="w-full max-w-md px-4">
			<h2 class="mb-1 text-xl font-medium">Step 2 of 3</h2>
			<h1 class="mb-6 text-3xl font-bold">Your First and Last Name</h1>

			<div class="mb-8 flex items-center">
				<span class="text-lg">Votist requires real names.</span>
				<button on:click={handleWhyClick} class="ml-1 text-lg text-blue-500 underline">Why?</button>
			</div>

			<div class="mb-8">
				<label class="mb-2 block text-gray-700">First</label>
				<input
					type="text"
					bind:value={firstName}
					placeholder="First name"
					class="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
				/>
			</div>

			<div class="mb-8">
				<label class="mb-2 block text-gray-700">Last</label>
				<input
					type="text"
					bind:value={lastName}
					placeholder="Last name"
					class="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
				/>
			</div>

			<div class="mb-6">
				<label class="mb-2 block text-gray-700">A Pseudonym for Non-Members</label>
				<input
					type="text"
					bind:value={pseudonym}
					placeholder="Pseudonym"
					class="w-full rounded border border-gray-200 bg-gray-100 px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
				/>
			</div>

			<div class="flex justify-end">
				<button
					on:click={handleNext}
					class="rounded bg-teal-600 px-6 py-2 text-white shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] transition hover:bg-teal-500"
				>
					Next
				</button>
			</div>
		</div>
	</div>
</div> -->
