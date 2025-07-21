<script lang="ts">
	import { signupStore } from './signup-store';
	import RealNameModal from './RealNameModal.svelte';

	export let nextStep: () => void;
	export let prevStep: () => void;

	let showModal = false;

	function toggleModal() {
		showModal = !showModal;
	}
	let firstName = $signupStore.firstName;
	let lastName = $signupStore.lastName;
	let error = '';

	function validate() {
		error = '';
		
		if (!firstName.trim() || !lastName.trim()) {
			error = 'Please enter your full name';
			return false;
		}
		return true;
	}

	function handleNext() {
		if (!validate()) return;
		$signupStore = { ...$signupStore, firstName, lastName };
		nextStep();
	}
</script>

<div class="space-y-6">
	<div class="space-y-4">
		<div class="mb-4 text-sm text-[#6B7280]">
			Votist requires real names. <button
				on:click={toggleModal}
				class="font-medium text-[#167B9B] hover:text-[#155E75] hover:underline">Why?</button
			>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div class="form-control">
      <label class="label" for="firstName">
					<span class="label-text font-medium text-[#1E1E1E]">First Name</span>
				</label>
				<input
					type="text"
					class="input input-bordered w-full"
					placeholder="Enter your first name"
					bind:value={firstName}
				/>
			</div>

			<div class="form-control">
				<label class="label" for="lastName">
					<span class="label-text font-medium text-[#1E1E1E]">Last Name</span>
				</label>
				<input
					type="text"
					class="input input-bordered w-full"
					placeholder="Enter your last name"
					bind:value={lastName}
				/>
			</div>

		</div>
	</div>

	{#if error}
		<div class="text-sm text-red-600">{error}</div>
	{/if}

	<div class="flex justify-between">
		<button on:click={prevStep} class="btn btn-ghost text-[#167B9B] hover:bg-gray-100">
			Back
		</button>
		<button on:click={handleNext} class="btn bg-[#167B9B] text-white hover:bg-[#155E75]">
			Next
		</button>
	</div>
</div>

<RealNameModal bind:open={showModal} />
