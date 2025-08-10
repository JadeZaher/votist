<script lang="ts">
	import { onMount } from 'svelte';
	import { signupStore } from './signup-store';

	export let handleSubmit: () => void;
	let phone = '';
	let error = '';

	function validate() {
		error = '';
		return true;
	}

	function handleFinalSubmit() {
		if (!validate()) return;
		signupStore.update((store) => ({ ...store, phoneNumber: phone }));
		handleSubmit();
	}
</script>

<div class="space-y-6">
	<div class="space-y-4">
		<div class="form-control">
			<label class="label">
				<span class="label-text font-medium text-[#1E1E1E]">Phone Number</span>
			</label>
			<input
				type="tel"
				class="input input-bordered w-full"
				placeholder="+12345678900"
				bind:value={phone}
			/>
		</div>
		<div id="clerk-captcha"></div>
	</div>

	{#if error}
		<div class="text-sm text-red-600">{error}</div>
	{/if}

	<div class="flex justify-end">
		<button
			on:click={handleFinalSubmit}
			class="btn w-fit bg-[#167B9B] text-white hover:bg-[#155E75]"
		>
			Sign Up
		</button>
	</div>
</div>
