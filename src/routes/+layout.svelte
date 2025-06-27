<script lang="ts">
	import '../app.css';
	import logo from '$lib/assets/logo/logo-header.png';
	import { ClerkProvider, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import type { LayoutData } from './$types';

	let { data } = $props<{ data: LayoutData }>();
</script>

<ClerkProvider {...data.clerk}>
	<SignedIn>
		<div class="navbar bg-base-100">
			<div class="navbar-start min-w-14">
				<a href="/">
					<img class="m-5 w-32" src={logo} alt="votist logo" />
				</a>
			</div>
			<div class="flex flex-none flex-row items-start justify-end space-x-4">
				<div class="flex flex-col">
					<a href="project/san-rafael" class=" bg-votist-blue">San Rafeal Project</a>
					<!-- profile info -->
					<p class="text-right text-2xl">{data.user?.fullName}</p>
					<p class="text-right">{data.user?.role}</p>
				</div>
				<div>
					<UserButton afterSignOutUrl="/" />
				</div>
			</div>
		</div>
	</SignedIn>

	<SignedOut>
		<div class="navbar bg-base-100">
			<div class="navbar-start">
				<a href="/">
					<img class="m-5 w-32" src={logo} alt="votist logo" />
				</a>
			</div>
			<div class="navbar-end">
				<a href="project/san-rafael" class=" text-votist-blue mx-5 font-semibold">
					San Rafeal Project
				</a>
				<a href="/sign-up" class="btn btn-primary">Register</a>
				<a href="/sign-in" class="btn btn-ghost">Sign in</a>
			</div>
		</div>
	</SignedOut>

	{@render children()}

	<footer class="border-t border-gray-200 py-12">
		<div class="mx-auto max-w-7xl px-4">
			<div class="flex items-center justify-between">
				<!-- Left side - Logo and copyright -->
				<div class="flex items-center space-x-2">
					<img src={logo} alt="Votist Logo" class="w-20" />
				</div>

				<!-- Center - Navigation links -->
				<div class="ml-[-18vw] flex flex-col space-x-8">
					<a href="/terms" class="text-sm hover:text-gray-900">ToS</a>
					<a href="/privacy" class="text-sm hover:text-gray-900">Privacy</a>
					<a href="/about" class="text-sm hover:text-gray-900">What is votist</a>
					<a href="/feedback" class="text-sm hover:text-gray-900">Your Feedback</a>
				</div>

				<!-- Right side - Support -->
				<div></div>
			</div>

			<!-- Bottom text -->
			<div class="mt-8 flex justify-between text-center">
				<span class="text-sm text-gray-500">© 2025</span>
				<p class="text-sm text-gray-500">
					Votist is a Proof of Concept Project of Translucent Studios LLC.
				</p>
				<div>
					<a href="/support" class="text-sm hover:text-gray-900">Support</a>
				</div>
			</div>
		</div>
	</footer>
</ClerkProvider>
