<script lang="ts">
	import type { PollFeedData, PostData, CommentData } from '$lib/types';
	import DiscussionForum from './DiscussionForum.svelte';
	import { onMount } from 'svelte';

	// State variables
	let polls: PollFeedData[] = [];
	let loading = true;
	let error: string | null = null;

	// Helper function to format timestamp
	function formatTimestamp(date: Date): string {
		const now = new Date();
		const diffInMs = now.getTime() - date.getTime();
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

	// Helper function to generate placeholder avatar
	function getPlaceholderAvatar(name: string): string {
		// Generate a simple avatar URL based on name
		const initials = name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase();
		return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=150`;
	}

	// Helper function to generate placeholder poll data
	function generatePlaceholderPoll(post: any): any {
		// If post already has a poll, use it
		if (post.poll && post.poll.options && post.poll.options.length > 0) {
			return {
				question: post.poll.question || post.title,
				options: post.poll.options.map((option: any) => ({
					id: option.id,
					text: option.text,
					votes: option.votes || 0
				})),
				totalVotes: post.poll.totalVotes || 0,
				endsAt: post.poll.endsAt ? formatTimestamp(new Date(post.poll.endsAt)) : 'in 7 days'
			};
		}

		// Generate placeholder poll options based on category
		const categoryOptions: Record<string, string[]> = {
			Technology: ['Option A', 'Option B', 'Option C'],
			Politics: ['Yes', 'No', 'Undecided'],
			Environment: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree'],
			'General Discussion': ['Option 1', 'Option 2', 'Option 3'],
			Education: ['Excellent', 'Good', 'Average', 'Poor']
		};

		const options = categoryOptions[post.category] || ['Option A', 'Option B', 'Option C'];

		return {
			question: post.title,
			options: options.map((text, index) => ({
				id: `placeholder-${post.id}-${index}`,
				text,
				votes: Math.floor(Math.random() * 100) // Random vote count
			})),
			totalVotes: Math.floor(Math.random() * 500),
			endsAt: 'in 7 days'
		};
	}

	// Transform API post data to PollFeedData format
	function transformPostToPollFeedData(post: any): PollFeedData {
		// Transform comments
		const transformedComments: CommentData[] = (post.comments || []).map((comment: any) => ({
			id: comment.id,
			author: {
				name: comment.author.name || 'Anonymous User',
				avatar: comment.author.avatar || getPlaceholderAvatar(comment.author.name || 'Anonymous'),
				username: comment.author.username || 'user'
			},
			content: comment.content,
			timestamp: formatTimestamp(new Date(comment.createdAt)),
			likes: comment.likes || 0, // Use actual likes from database
			isLiked: comment.isLiked || false, // Use actual isLiked from database
			replies: (comment.replies || []).map((reply: any) => ({
				id: reply.id,
				author: {
					name: reply.author.name || 'Anonymous User',
					avatar: reply.author.avatar || getPlaceholderAvatar(reply.author.name || 'Anonymous'),
					username: reply.author.username || 'user'
				},
				content: reply.content,
				timestamp: formatTimestamp(new Date(reply.createdAt)),
				likes: reply.likes || 0, // Use actual likes from database
				isLiked: reply.isLiked || false // Use actual isLiked from database
			}))
		}));

		// Transform post data
		const transformedPost: PostData = {
			id: post.id,
			title: post.title,
			content: post.content,
			author: {
				name: post.author.name || 'Anonymous User',
				avatar: post.author.avatar || getPlaceholderAvatar(post.author.name || 'Anonymous'),
				username: post.author.username || 'user',
				isVerified: post.author.isVerified || false
			},
			timestamp: formatTimestamp(new Date(post.createdAt)),
			category: post.category,
			likes: post.likes || 0, // Use actual likes from database
			comments: post._count?.comments || 0,
			isLiked: post.isLiked || false, // Use actual isLiked from database
			isBookmarked: post.isBookmarked || false, // Use actual isBookmarked from database
			tags: post.tags || [post.category.toLowerCase()], // Use category as tag if no tags
			poll: generatePlaceholderPoll(post)
		};

		return {
			post: transformedPost,
			comments: transformedComments
		};
	}

	// Fetch posts from API
	async function fetchPosts() {
		try {
			loading = true;
			error = null;

			const response = await fetch('/api/posts?limit=10');
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.error) {
				throw new Error(data.error);
			}

			// Transform the posts to match PollFeedData interface
			polls = data.posts.map(transformPostToPollFeedData);
		} catch (err) {
			console.error('Error fetching posts:', err);
			error = err instanceof Error ? err.message : 'Failed to load posts';
			polls = []; // Set empty array on error
		} finally {
			loading = false;
		}
	}

	// Load posts on component mount
	onMount(() => {
		fetchPosts();
	});
</script>

<div class="mx-auto max-w-4xl space-y-6 p-4">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold">Community Polls</h1>
		<p class="text-muted-foreground text-gray-600">
			Engage with the developer community by voting on polls and joining discussions
		</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center py-12">
			<div class="loading loading-spinner loading-lg text-primary"></div>
			<span class="ml-4 text-lg">Loading polls...</span>
		</div>
	{:else if error}
		<div class="alert alert-error">
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
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			<div>
				<h3 class="font-bold">Error loading polls</h3>
				<div class="text-xs">{error}</div>
			</div>
			<button class="btn btn-sm btn-outline" on:click={fetchPosts}>Retry</button>
		</div>
	{:else if polls.length === 0}
		<div class="py-12 text-center">
			<div class="mb-4 text-6xl">🗳️</div>
			<h3 class="mb-2 text-xl font-semibold">No polls available</h3>
			<p class="mb-4 text-gray-600">There are no polls to display at the moment.</p>
			<button class="btn btn-primary" on:click={fetchPosts}>Refresh</button>
		</div>
	{:else}
		{#each polls as pollData (pollData.post.id)}
			<DiscussionForum {pollData} />
		{/each}
	{/if}
</div>
