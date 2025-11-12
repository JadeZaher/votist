<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import logo from '$lib/assets/logo/logo-white.png';
	import Step1EmailPassword from './Step1EmailPassword.svelte';
	import Step2NameEntry from './Step2NameEntry.svelte';
	import Step3Confirmation from './Step3Confirmation.svelte';
	import { signupStore } from './signup-store';
	import { handleSocialAuth } from './social-auth';

	// Check if user is already authenticated
	onMount(async () => {
		// Check if already authenticated via Clerk
		if (browser) {
			const clerk = (window as any).Clerk;
			// Wait for Clerk to be ready
			if (clerk && await clerk.loaded) {
				if (clerk.user) {
					window.location.href = '/';
				}
			}
		}
	});

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
			const { email, password, firstName, lastName, dob, phoneNumber } = $signupStore;
			const clerk = (window as any).Clerk;

			if (!clerk) throw new Error('Authentication service not available');

			const signUpAttempt = await clerk.client.signUp.create({
				emailAddress: email,
				password,
				firstName,
				lastName,
				dob,
				phoneNumber: $signupStore.phoneNumber
			});

			if (signUpAttempt.status === 'complete') {
				await clerk.setActive({ session: signUpAttempt.createdSessionId });

				// Reset store after successful submission
				signupStore.set({
					email: '',
					password: '',
					firstName: '',
					lastName: '',
					dob: '',
					phoneNumber: ''
				});

				// Wait a moment for session cookie to be set
				await new Promise(resolve => setTimeout(resolve, 500));

				// Force a full page reload to ensure server sees the session
				window.location.href = '/';
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
				<button
					type="button"
					class="btn btn-outline w-full"
					on:click={() => handleSocialAuth('google', true)}
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Sign up with Google
				</button>
				<button
					type="button"
					class="btn btn-outline w-full"
					on:click={() => handleSocialAuth('linkedin', true)}
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
						<path
							d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
						/>
					</svg>
					Sign up with LinkedIn
				</button>
				<div class="divider">OR</div>
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
