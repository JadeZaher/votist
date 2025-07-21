<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import logo from '$lib/assets/logo/logo-header.png';
	import profileIcon from '$lib/assets/icons/profile-outline.png';
	import knowledgeIcon from '$lib/assets/icons/knowledge.png';
	import charismaIcon from '$lib/assets/icons/charisma.png';

	const navItems = [
		{ name: 'Home', path: '/dashboard', icon: 'home' },
		{ name: 'Research', path: '/research', icon: 'research' },
		{ name: 'Discuss', path: '/discuss', icon: 'discuss', badge: 24 },
		{ name: 'Level Up', path: '/level-up', icon: 'level' },
		{ name: 'Vote', path: '/vote', icon: 'vote' },
		{ name: 'Profile', path: '/profile', icon: 'profile', plusOne: true },
		{ name: 'Settings', path: '/settings', icon: 'settings' }
	];
	import { SignOutButton } from 'svelte-clerk';

	function signOut() {
		// The SignOutButton will handle the redirect automatically
	}
</script>

<!-- Fixed Header -->
<header
	class="fixed top-0 left-0 z-20 flex h-16 w-full items-center border-b bg-white px-2 py-2 md:px-8"
>
	<img src={logo} alt="Votist logo" class="mr-4 h-8 w-auto" />
	<div class="flex flex-1 items-center justify-end">
		<span class="mr-2 hidden text-lg font-semibold md:inline-block">San Rafael Project</span>
		<SignOutButton afterSignOutUrl="/sign-in">
			<button class="btn btn-error ml-2">Sign out</button>
		</SignOutButton>
	</div>
</header>

<!-- Main layout below header -->
<div class="flex min-h-screen bg-white pt-16">
	<!-- Sidebar below header -->
	<aside
		class="relative hidden min-h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white px-0 py-0 md:flex"
	>
		<!-- Top horizontal line -->
		<div class="mb-4 w-full border-b border-gray-200"></div>
		<!-- User Profile Icon -->
		<div class="mt-4 mb-2 flex flex-col items-center">
			<div
				class="flex h-14 w-14 items-center justify-center rounded-full border border-gray-300 bg-white"
			>
				<img src={profileIcon} alt="Profile" class="h-8 w-8" />
			</div>
			<div class="mt-2 text-base font-semibold text-gray-900">
				{$page.data.user?.fullName ?? 'User Name'}
			</div>
			<!-- Knowledge and Charisma badges -->
			<div class="mt-2 flex w-full flex-col items-center gap-1">
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
		<!-- Navigation (no horizontal line here) -->
		<nav class="mt-2 flex flex-col gap-1 px-2">
			{#each navItems as item}
				<a
					href={item.path}
					class="group flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium transition-colors hover:bg-gray-100
						{$page.url.pathname === item.path ? 'bg-gray-50 font-bold text-[#167b9b]' : 'text-gray-800'}"
				>
					<img
						src={`/src/lib/assets/icons/${item.icon}${$page.url.pathname === item.path ? '-filled' : '-outline'}.png`}
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
	>
		<slot />
	</main>
</div>
