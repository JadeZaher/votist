<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import logo from '$lib/assets/logo/logo-header.png';
	import { ClerkProvider, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';
	import profileIcon from '$lib/assets/icons/profile-outline.png';
	import knowledgeIcon from '$lib/assets/icons/knowledge.png';
	import charismaIcon from '$lib/assets/icons/charisma.png';

	// Import all navigation icons
	import homeOutline from '$lib/assets/icons/home-outline.png';
	import homeFilled from '$lib/assets/icons/home-filled.png';
	import voteOutline from '$lib/assets/icons/vote-outline.png';
	import voteFilled from '$lib/assets/icons/vote-filled.png';
	import levelOutline from '$lib/assets/icons/level-outline.png';
	import levelFilled from '$lib/assets/icons/level-filled.png';

	const navItems = [
		{
			name: 'Home',
			path: '/',
			icon: 'home',
			iconOutline: homeOutline,
			iconFilled: homeFilled
		},
		{
			name: 'Assembly',
			path: '/vote',
			icon: 'vote',
			iconOutline: voteOutline,
			iconFilled: voteFilled
		},
		{
			name: 'Level Up',
			path: '/san-rafael',
			icon: 'level',
			iconOutline: levelOutline,
			iconFilled: levelFilled
		}
	];

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<ClerkProvider {...data.clerk}>
	<SignedIn>
		<!-- Main layout below header -->
		<div class="fixed z-10 min-h-screen border-gray-200 bg-white">
			<!-- Top horizontal line -->
			<div class="navbar-start h-full w-full border-gray-200">
				<a href="/">
					<img class="m-5 w-32" src={logo} alt="votist logo" />
				</a>
			</div>
			<!-- Sidebar below header -->
			<aside
				class="relative hidden min-h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white px-0 py-0 md:flex"
			>
				<div class="mb-4 w-full border-b"></div>

				<!-- Navigation (no horizontal line here) -->
				<nav class="mt-2 flex flex-col gap-1 px-2">
					{#each navItems as item}
						<a
							href={item.path}
							class="group flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-gray-100
						{page.url.pathname === item.path ? 'bg-gray-50 font-bold text-[#167b9b]' : 'text-gray-800'}"
						>
							<img
								src={page.url.pathname === item.path ? item.iconFilled : item.iconOutline}
								alt={item.name}
								class="h-6 w-6"
							/>
							<span>{item.name}</span>
							{#if item.badge}
								<span
									class="ml-auto rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700"
									>{item.badge}</span
								>
							{/if}
							{#if item.plusOne}
								<span class="ml-auto text-xs font-semibold text-[#669999]">+1</span>
							{/if}
						</a>
					{/each}
					<div class="mt-4 mb-2 flex flex-col items-center">
						<div class="flex flex-none flex-row items-center justify-end space-x-4">
							<div class="flex flex-col">
								<!-- profile info -->
								<p class="text-right text-2xl">{data.user?.fullName}</p>
								<p class="text-right">{data.user?.role}</p>
								<!-- Knowledge and Charisma badges -->
								<div class="mt-2 flex w-full flex-col items-end gap-1">
									<div class="flex items-center gap-1 text-xs">
										<img src={knowledgeIcon} class="h-4 w-4" alt="Knowledge" />
										<span class="font-semibold text-[#167b9b]">+1</span>
										<span class="text-[#167b9b]">Knowledge</span>
									</div>
									<div class="flex items-center gap-1 text-xs">
										<img src={charismaIcon} class="h-4 w-4" alt="Charisma" />
										<span class="font-semibold text-[#f9d026]">+10</span>
										<span class="text-[#80538d]">Charisma</span>
									</div>
								</div>
							</div>
							<!-- User Profile Icon -->
							<div class=" border-votist-yellow rounded-full border-2 p-2">
								<UserButton afterSignOutUrl="/" />
							</div>
						</div>
					</div>
				</nav>
				<!-- Assembly Section at bottom -->
				<div class="absolute bottom-6 left-0 w-full px-6">
					<div class="mb-1 text-xs font-semibold text-gray-500">Assembly</div>
					<div class="text-xl leading-tight font-bold text-[#167b9b]">San Rafael</div>
					<div class="text-xs font-medium text-[#167b9b]">Housing and the Future</div>
				</div>
			</aside>

			<!-- Main Content Area below header and to the right of sidebar -->
			<main
				class="flex min-h-[calc(100vh-4rem)] flex-1 items-center justify-center bg-white p-4 md:p-8"
			></main>
		</div>
		<div class="ml-64 max-w-[calc(100vw-16rem)]">
			{@render children?.()}
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
		{@render children?.()}
	</SignedOut>

	<Footer />
</ClerkProvider>
