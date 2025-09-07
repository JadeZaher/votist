<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import type { Post } from '$lib/types';
	import PostForm from './components/PostForm.svelte';
	import PostList from './components/PostList.svelte';

	let showForm = false;
	let posts: Post[] = [];
	let loading = true;
	let toastMessage = '';
	let showToast = false;
	let toastTimeout: NodeJS.Timeout | null = null;

	// Function to show toast and auto-hide after 5 seconds
	function showToastMessage(message: string) {
		// Clear any existing timeout
		if (toastTimeout) {
			clearTimeout(toastTimeout);
		}

		toastMessage = message;
		showToast = true;

		// Hide the toast after 5 seconds
		toastTimeout = setTimeout(() => {
			showToast = false;
			toastMessage = '';
			toastTimeout = null;
		}, 5000);
	}

	// Function to hide toast immediately
	function hideToast() {
		showToast = false;
		toastMessage = '';
		if (toastTimeout) {
			clearTimeout(toastTimeout);
			toastTimeout = null;
		}
	}

	// Check for success message in URL parameters on mount and when page changes
	$: {
		const urlParams = new URLSearchParams($page.url.search);
		const message = urlParams.get('success') || '';

		if (message && $page.url.pathname.includes('/admin/posts')) {
			// Clear the URL parameter immediately
			window.history.replaceState({}, '', '/admin/posts');
			showToastMessage(message);
			// Hide the form when there's a success message (post was created/updated)
			showForm = false;
			// Refresh posts list to show the latest post
			refreshPosts();
		} else if (!$page.url.pathname.includes('/admin/posts')) {
			// Hide toast when navigating away from posts page
			hideToast();
		}
	}

	// Ensure form is hidden when navigating to posts page (unless explicitly showing form)
	$: if ($page.url.pathname === '/admin/posts' && !$page.url.search.includes('showForm=true')) {
		showForm = false;
	}

	// Clean up timeout when component is destroyed
	onDestroy(() => {
		if (toastTimeout) {
			clearTimeout(toastTimeout);
		}
	});

	// Function to refresh posts list
	async function refreshPosts() {
		try {
			const response = await fetch('/api/posts?admin=true');
			const data = await response.json();
			posts = data.posts || [];
		} catch (error) {
			console.error('Error refreshing posts:', error);
		}
	}

	// Handle post deletion
	function handlePostDelete(event: CustomEvent<{ id: string; title: string }>) {
		const { title } = event.detail;
		// Remove the deleted post from the local array
		posts = posts.filter((post) => post.id !== event.detail.id);
		// Show success toast
		showToastMessage(`"${title}" was successfully deleted`);
	}

	onMount(async () => {
		const response = await fetch('/api/posts?admin=true');
		const data = await response.json();
		posts = data.posts || [];
		loading = false;
	});
</script>

<div class="mb-6 flex items-center justify-between">
	<h1 class="text-3xl font-bold">Post Management</h1>
	{#if showForm}
		<a href="/admin/posts" class="btn btn-primary">Show Post List</a>
	{:else}
		<button class="btn btn-primary" on:click={() => (showForm = true)}>Create New Post</button>
	{/if}
</div>

<!-- Toast Container -->
<div class="toast toast-top toast-end">
	{#if showToast}
		<div class="alert alert-success">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6 shrink-0 stroke-current"
				fill="none"
				viewBox="0 0 24 24"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<span>{toastMessage}</span>
			<button
				class="btn btn-sm btn-circle btn-ghost"
				on:click={hideToast}
				aria-label="Close notification"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>
	{/if}
</div>

<div class="divider"></div>

{#if loading}
	<div class="flex justify-center">
		<span class="loading loading-spinner loading-lg"></span>
	</div>
{:else if showForm}
	<div class="max-w-4xl">
		<PostForm on:cancel={() => (showForm = false)} />
	</div>
{:else}
	<div class="w-full">
		<PostList {posts} on:deletePost={handlePostDelete} />
	</div>
{/if}
