<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';
	import logo from '$lib/assets/logo/logo-header.png';
	import { ClerkProvider, SignedIn, SignedOut, UserButton } from 'svelte-clerk';
	import type { LayoutData } from './$types';
	import Footer from '$lib/components/Footer.svelte';

	// Import all navigation icons
	import homeOutline from '$lib/assets/icons/home-outline.png';
	import homeFilled from '$lib/assets/icons/home-filled.png';
	import researchOutline from '$lib/assets/icons/research-outline.png';
	import researchFilled from '$lib/assets/icons/research-filled.png';
	import discussOutline from '$lib/assets/icons/discuss-outline.png';
	import discussFilled from '$lib/assets/icons/discuss-filled.png';
	import voteOutline from '$lib/assets/icons/vote-outline.png';
	import voteFilled from '$lib/assets/icons/vote-filled.png';
	import levelOutline from '$lib/assets/icons/level-outline.png';
	import levelFilled from '$lib/assets/icons/level-filled.png';
	import profileOutline from '$lib/assets/icons/profile-outline.png';
	import profileFilled from '$lib/assets/icons/profile-filled.png';
	import settingsOutline from '$lib/assets/icons/settings-outline.png';
	import settingsFilled from '$lib/assets/icons/settings-filled.png';

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
			path: null,
			icon: null,
			iconOutline: null,
			iconFilled: null,
			isSubsection: true,
			subsections: [
				{
					name: 'San Rafael',
					path: '/san-rafael',
					subtitle: 'Housing and the Future'
				}
			]
		},
		{
			name: 'Research',
			path: '/research',
			icon: 'research',
			iconOutline: researchOutline,
			iconFilled: researchFilled
		},
		{
			name: 'Discuss & Vote',
			path: '/vote',
			icon: 'vote',
			iconOutline: voteOutline,
			iconFilled: voteFilled,
			notification: '24'
		},
		{
			name: 'Level Up',
			path: '/san-rafael',
			icon: 'level',
			iconOutline: levelOutline,
			iconFilled: levelFilled
		}
	];

	const bottomNavItems = [
		{
			name: 'Profile',
			path: '/profile',
			icon: 'profile',
			iconOutline: profileOutline,
			iconFilled: profileFilled,
			notification: '+1'
		},
		{
			name: 'Settings',
			path: '/settings',
			icon: 'settings',
			iconOutline: settingsOutline,
			iconFilled: settingsFilled
		}
	];

	let { children, data }: { children: any; data: LayoutData } = $props();
</script>

<ClerkProvider {...data.clerk}>
	<SignedIn>
		<!-- Main layout with sidebar -->
		<div class=" flex bg-white">
			<!-- Sidebar -->
			<aside class="fixed h-screen w-64 border-r border-blue-200 bg-white shadow-lg">
				<div class="flex h-full flex-col">
					<!-- Logo Section -->
					<div class="border-b border-blue-200 p-6">
						<a href="/">
							<img class="w-32" src={logo} alt="votist logo" />
						</a>
					</div>

					<!-- User Profile Section -->
					<div class="border-b border-blue-200 p-6">
						<!-- Circular Profile Picture -->
						<div class="m-4 mx-10 scale-150">
							<UserButton />
						</div>

						<!-- Username -->
						<h2 class="mb-1 text-lg font-bold text-gray-800">
							{data.user?.fullName || 'testadmin'}
						</h2>
						<p class="mb-1 text-sm text-gray-600">{data.user?.role || 'Step-Mayor In-Law'}</p>
						<p class="text-sm text-gray-600">Fairfax CA</p>
					</div>

					<!-- Navigation -->
					<nav class="flex-1 space-y-1 p-4">
						{#each navItems as item}
							{#if item.isSubsection}
								<!-- Assembly Section -->
								<div class="mb-2">
									<p class="px-3 py-1 text-sm text-gray-400">Assembly</p>
									{#each item.subsections as subsection}
										<a
											href={subsection.path}
											class="flex flex-col px-3 py-2 hover:bg-gray-50 {page.url.pathname ===
											subsection.path
												? 'bg-gray-50 font-bold text-teal-600'
												: 'text-gray-700'}"
										>
											<span class="text-lg font-bold text-teal-500">{subsection.name}</span>
											<span class="text-sm text-teal-500">{subsection.subtitle}</span>
										</a>
									{/each}
								</div>
							{:else}
								<a
									href={item.path}
									class="flex items-center rounded-lg p-3 hover:bg-gray-50 {page.url.pathname ===
									item.path
										? 'bg-gray-50 font-bold text-teal-600'
										: 'text-gray-700'}"
								>
									<img
										src={page.url.pathname === item.path ? item.iconFilled : item.iconOutline}
										alt={item.name}
										class="mr-3 h-5 w-5"
									/>
									<span class="flex-1">{item.name}</span>
									{#if item.notification}
										<span class="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
											{item.notification}
										</span>
									{/if}
								</a>
							{/if}
						{/each}
					</nav>

					<!-- Bottom Navigation (Profile & Settings) -->
					<div class="border-t border-gray-200 p-4">
						<nav class="space-y-1">
							{#each bottomNavItems as item}
								<a
									href={item.path}
									class="flex items-center rounded-lg p-3 hover:bg-gray-50 {page.url.pathname ===
									item.path
										? 'bg-gray-50 font-bold text-teal-600'
										: 'text-gray-700'}"
								>
									<img
										src={page.url.pathname === item.path ? item.iconFilled : item.iconOutline}
										alt={item.name}
										class="mr-3 h-5 w-5"
									/>
									<span class="flex-1">{item.name}</span>
									{#if item.notification}
										<span class="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700">
											{item.notification}
										</span>
									{/if}
								</a>
							{/each}
						</nav>
					</div>
				</div>
			</aside>

			<!-- Main Content Area -->
			<main class="ml-[16rem] min-h-screen flex-1">
				{@render children?.()}
			</main>
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
