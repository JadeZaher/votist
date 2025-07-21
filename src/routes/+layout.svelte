<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import '../app.css';
	import logo from '$lib/assets/logo/logo-header.png';
	import { ClerkProvider, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';

	let { children, data }: { children: any; data: LayoutData } = $props();

	// Handle redirects based on authentication state
	$effect(() => {
		const currentPath = $page.url.pathname;
		const isAuthenticated = !!data.user;

		// Redirect unauthenticated users from protected routes
		if (
			!isAuthenticated &&
			(currentPath.startsWith('/dashboard') || currentPath.startsWith('/admin'))
		) {
			goto('/sign-in');
		}

		// Redirect authenticated users from public routes to dashboard
		if (isAuthenticated && currentPath === '/') {
			goto('/dashboard');
		}
	});
</script>

<ClerkProvider {...data.clerk}>
	{#if $page.url.pathname.startsWith('/dashboard')}
		{@render children()}
	{:else}
		{#if !$page.url.pathname.startsWith('/sign-in') && !$page.url.pathname.startsWith('/sign-up')}
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
							<UserButton afterSignOutUrl="/sign-in" />
						</div>
					</div>
				</div>
			</SignedIn>
		{/if}

		{#if !$page.url.pathname.startsWith('/sign-in') && !$page.url.pathname.startsWith('/sign-up')}
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
		{/if}

		{@render children()}

		<Footer />
	{/if}
</ClerkProvider>
