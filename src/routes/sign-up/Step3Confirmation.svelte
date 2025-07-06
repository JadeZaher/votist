<script lang="ts">
	import { signupStore } from './signup-store';

	export let handleSubmit: () => Promise<void> = async () => {};
	let phone = '';
	let error = '';
	let isCaptchaVerified = false; // Captcha placeholder

	function validate() {
		error = '';
		if (!phone.match(/^\d{10,15}$/)) {
			error = 'Please enter a valid phone number';
			return false;
		}
		if (!isCaptchaVerified) {
			error = "Please verify you're human";
			return false;
		}
		return true;
	}

  function handleNext() {
    if (!validate()) return;
    // Phone number needs explicit update since it's not bound via store
    signupStore.update(store => ({ ...store, phoneNumber: phone }));
    handleSubmit();
  }
</script>

<div class="space-y-6">
	<div class="space-y-4">
		<div class="form-control">
			<label class="label">
				<span class="label-text font-medium text-[#1E1E1E]">Phone number</span>
			</label>
			<input
				type="tel"
				class="input input-bordered w-full"
				placeholder="Phone"
				bind:value={phone}
			/>
		</div>

		<div class="flex h-[78px] items-center justify-center rounded-lg bg-gray-100 text-gray-500">
			[hCaptcha placeholder]
		</div>
	</div>

	{#if error}
		<div class="text-sm text-red-600">{error}</div>
	{/if}

	<div class="flex justify-end">
		<button on:click={handleNext} class="btn bg-[#167B9B] text-white hover:bg-[#155E75]">
      Sign Up
		</button>
	</div>
</div>
