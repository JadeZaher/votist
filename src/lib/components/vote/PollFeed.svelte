<script lang="ts">
	import type { PollFeedData } from '$lib/types';
	import DiscussionForum from './DiscussionForum.svelte';

	export let polls: PollFeedData[];
	export let isAuthenticated: boolean;
	export let user: any;

	// Helper function to format timestamp (kept for any client-side needs)
	function formatTimestamp(date: string): string {
		const now = new Date();
		const postDate = new Date(date);
		const diffInMs = now.getTime() - postDate.getTime();
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInHours / 24);

		if (diffInDays > 0) {
			return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
		} else if (diffInHours > 0) {
			return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
		} else {
			const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
			return `${diffInMinutes} min ago`;
		}
	}

	// Helper function to generate placeholder avatar (kept if needed)
	function getPlaceholderAvatar(name: string): string {
		const initials = name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
		return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`;
	}
</script>

<div class="mx-auto max-w-4xl space-y-4 px-3 py-4 md:space-y-6 md:px-4">
	<div class="mb-4 md:mb-8">
		<h1 class="mb-2 text-2xl font-bold md:text-3xl">Community Polls</h1>
		<p class="text-muted-foreground text-sm text-gray-600 md:text-base">
			Engage with the developer community by voting on polls and joining discussions
		</p>
	</div>

	{#if polls.length === 0}
		<div class="py-12 text-center">
			<div class="mb-4 text-6xl">🗳️</div>
			<h3 class="mb-2 text-xl font-semibold">No polls available</h3>
			<p class="mb-4 text-gray-600">There are no polls to display at the moment.</p>
		</div>
	{:else}
		{#each polls as pollData (pollData.post.id)}
			<DiscussionForum
				{pollData}
				{isAuthenticated}
				{user}
				quizGateBlocked={pollData.quizGateBlocked}
				quizGateMessage={pollData.quizGateMessage}
			/>
		{/each}
	{/if}
</div>
