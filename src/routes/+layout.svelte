<script lang="ts">
	import '../app.css';
	import logo from '$lib/assets/logo/votist-logo.png';
	import SignedIn from 'clerk-sveltekit/client/SignedIn.svelte';
	import SignedOut from 'clerk-sveltekit/client/SignedOut.svelte';
	import UserButton from 'clerk-sveltekit/client/UserButton.svelte';

	let { children } = $props();
</script>

<SignedIn>
	<div class="navbar bg-base-100">
		<div class="navbar-start">
			<a href="/">
				<img class="m-1 w-16" src={logo} alt="votist logo" />
			</a>
		</div>
		<div class="flex flex-none flex-row items-start justify-end space-x-4">
			<div class="flex flex-col">
				<!-- profile info -->
				<p class="text-right text-2xl">Josh Mehler</p>
				<p class="text-right">Founder, Votist</p>
			</div>
			<div>
				<div class="grid grid-cols-2">
					<!-- stats -->
					<div class="flex flex-col flex-wrap gap-2">
						<div class="mx-4 flex justify-between space-x-2">
							<p class="text-sm">Knowledge</p>
							<div class="badge badge-secondary">+1</div>
						</div>
						<div class="mx-4 flex justify-between space-x-2">
							<p class=" text-sm">Charisma</p>
							<div class="badge badge-accent">+1</div>
						</div>
					</div>
					<!-- tags -->
					<div class="flex flex-col flex-wrap gap-2">
						<div class="mx-4 flex justify-between space-x-2">
							<p class="text-sm">Votist</p>
							<div class="badge badge-primary">+1</div>
						</div>
						<div class="mx-4 flex justify-between space-x-2">
							<p class="text-sm">Scholar</p>
							<div class="badge badge-info">+1</div>
						</div>
						<div class="mx-4 flex justify-between space-x-2">
							<p class="text-sm">Mentor</p>
							<div class="badge badge-success">+1</div>
						</div>
					</div>
				</div>
			</div>
			<a href="/">
				<button class="btn btn-ghost w-max">What is Votist?</button>
			</a>
			<button class="btn btn-ghost w-max">Settings</button>
			<UserButton afterSignOutUrl="/" />
		</div>
	</div>
	{@render children()}
</SignedIn>

<SignedOut>
	<!-- <div class="flex justify-center p-4">
		<a href="/sign-in" class="btn btn-primary mx-2">Sign in</a>
		<a href="/sign-up" class="btn btn-secondary mx-2">Sign up</a>
	</div> -->
	{@render children()}
</SignedOut>
