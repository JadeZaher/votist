<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import logo from '$lib/assets/logo/logo-white.png';
	import Step1EmailPassword from './Step1EmailPassword.svelte';
	import Step2NameEntry from './Step2NameEntry.svelte';
	import Step3Confirmation from './Step3Confirmation.svelte';
	import { signupStore } from './signup-store';

	let currentStep = 1;
	let loading = false;
	let error = '';

	const steps = [Step1EmailPassword, Step2NameEntry, Step3Confirmation];

	function nextStep() {
		if (currentStep < 3) currentStep++;
	}

	function prevStep() {
		if (currentStep > 1) currentStep--;
	}

	async function handleSubmit() {
		loading = true;
		try {
			const { email, password, firstName, lastName, dob, phoneNumber, captchaToken } = $signupStore;
			const clerk = (window as any).Clerk;

			if (!clerk) throw new Error('Authentication service not available');

				const signUpAttempt = await clerk.client.signUp.create({
					emailAddress: email,
					password,
					firstName,
					lastName,
					dob,
					phoneNumber: $signupStore.phoneNumber,
					captchaToken: $signupStore.captchaToken
			});

			if (signUpAttempt.status === 'complete') {
				await clerk.setActive({ session: signUpAttempt.createdSessionId });
				goto('/');
				// Reset store after successful submission
				signupStore.set({
					email: '',
					password: '',
					firstName: '',
					lastName: '',
					dob: '',
					phoneNumber: '',
					captchaToken: ''
				});
			} else {
				throw new Error('Account creation requires additional verification');
			}
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : 'Failed to create account';
		} finally {
			loading = false;
		}
	}
</script>

<div class="grid min-h-screen w-screen grid-cols-1 md:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
	<!-- Left Column (Logo) -->
	<div class="flex h-[40vh] items-center justify-center bg-[#167B9B] p-8 md:h-full">
		<img src={logo} alt="VOTIST" class="h-20 object-contain md:h-24" />
	</div>

	<!-- Right Column (Form) -->
	<div class="flex h-full items-center justify-start bg-white px-4 md:px-0">
		<div class="w-full space-y-8 px-4 py-6 pb-24 md:max-w-lg md:pr-6 md:pl-20">
			<h2 class="text-2xl font-bold text-[#1E1E1E] md:text-3xl">
				{#if currentStep === 1}Create Account{:else if currentStep === 2}Your Name{:else}Verify
					Phone{/if}
			</h2>

			<div class="space-y-6">
				{#if error}
					<div class="alert rounded-lg border-red-200 bg-red-100 p-3">
						<span class="font-medium text-red-800">{error}</span>
					</div>
				{/if}

				<svelte:component
					this={steps[currentStep - 1]}
					{nextStep}
					{prevStep}
					handleSubmit={currentStep === 3 ? handleSubmit : () => {}}
				/>
			</div>
		</div>
	</div>
</div>
