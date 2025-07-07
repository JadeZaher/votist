<script lang="ts">
	import { signupStore } from './signup-store';

	export let nextStep: () => void;

	let email = $signupStore.email;
	let password = $signupStore.password;
	let error = '';
	let checkingEmail = false;
	let emailError = '';
	let checkTimeout: NodeJS.Timeout;

	async function checkEmailExists() {
		if (!email.match(/^\S+@\S+\.\S+$/)) return;

		checkingEmail = true;
		emailError = '';
		error = '';
		try {
			const response = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`);
			if (!response.ok) throw new Error('Check failed');

			const { exists } = await response.json();
			if (exists) {
				emailError = 'An account already exists with this email';
			}
		} catch {
			emailError = 'Error checking email availability';
		} finally {
			checkingEmail = false;
		}
	}

	function handleEmailInput() {
		clearTimeout(checkTimeout);
		emailError = '';
		error = '';
		checkTimeout = setTimeout(checkEmailExists, 500);
	}

	function validate() {
		error = '';

		if (!email.match(/^\S+@\S+\.\S+$/)) {
			error = 'Please enter a valid email';
			return false;
		}

		if (emailError) {
			return false;
		}

		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return false;
		}

		if (!$signupStore.dob) {
			error = 'Please enter your date of birth';
			return false;
		}

		const dobDate = new Date($signupStore.dob);
		const today = new Date();
		if (isNaN(dobDate.getTime()) || dobDate >= today) {
			error = 'Please enter a valid date of birth';
			return false;
		}

		return true;
	}

	function handleNext() {
		if (!validate()) return;
		nextStep();
	}
</script>

<div class="space-y-6">
	<div class="space-y-4">
		<div class="form-control">
			<label class="label">
				<span class="label-text font-medium text-[#1E1E1E]">Email</span>
			</label>
			<input
				type="email"
				class="input input-bordered w-full"
				placeholder="Enter your email"
				bind:value={email}
				on:input={handleEmailInput}
			/>
			{#if emailError}
				<div class="mt-1 text-sm text-red-600">{emailError}</div>
			{/if}
			{#if checkingEmail}
				<div class="mt-1 text-sm text-[#167B9B]">Checking availability...</div>
			{/if}
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text font-medium text-[#1E1E1E]">Password</span>
			</label>
			<input
				type="password"
				class="input input-bordered w-full"
				placeholder="Create a password"
				bind:value={password}
			/>
		</div>

		<div class="form-control">
			<label class="label">
				<span class="label-text font-medium text-[#1E1E1E]">Your birth date</span>
			</label>
			<input
				type="date"
				class="input input-bordered w-full"
				bind:value={$signupStore.dob}
				max={new Date().toISOString().split('T')[0]}
			/>
		</div>
	</div>

	{#if error}
		<div class="text-sm text-red-600">{error}</div>
	{/if}

	<div class="flex items-center justify-between">
		<div class="text-sm text-[#6B7280]">
			Already have an account?
			<a href="/sign-in" class="text-[#167B9B] hover:text-[#155E75] hover:underline">Sign In</a>
		</div>
		<button
			on:click={handleNext}
			class="btn bg-[#167B9B] text-white hover:bg-[#155E75]"
			disabled={checkingEmail || !!emailError}
		>
			{#if checkingEmail}
				<span class="loading loading-spinner loading-xs"></span>
				Checking...
			{:else}
				Next
			{/if}
		</button>
	</div>
</div>
