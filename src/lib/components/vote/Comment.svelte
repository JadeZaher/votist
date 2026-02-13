<script lang="ts">
	import type { CommentData } from '$lib/types';
	import { MoreHorizontal, ArrowUp, MessageCircle } from 'lucide-svelte';

	export let comment: CommentData;
	export const onLike: (commentId: string) => void = () => {};
	export let onAddReply: (reply: CommentData) => void;
	export let depth = 0; // Still used for visual indentation but max 1 level
	export let postId: string;
	export let isAuthenticated: boolean;
	export let user: any;

	let showReplyForm = false;
	let replyContent = '';
	let showReplies = true;
	let isLiking = false;
	let isReplying = false;

	async function handleLike() {
		if (!isAuthenticated || isLiking) return;

		// Optimistic update
		const prevIsLiked = comment.isLiked || false;
		const prevLikes = comment.likes;
		comment.isLiked = !prevIsLiked;
		comment.likes = prevIsLiked ? comment.likes - 1 : comment.likes + 1;
		isLiking = true;

		try {
			const response = await fetch(`/api/comments/${comment.id}/like`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (response.ok) {
				// Update with actual values from server
				comment.likes = result.likes;
				comment.isLiked = result.isLiked;
			} else {
				// Revert on error
				comment.isLiked = prevIsLiked;
				comment.likes = prevLikes;
				console.error('Failed to like comment:', result.error);
			}
		} catch (error) {
			// Revert on error
			comment.isLiked = prevIsLiked;
			comment.likes = prevLikes;
			console.error('Error liking comment:', error);
		} finally {
			isLiking = false;
		}
	}

	async function handleReply() {
		if (!isAuthenticated || !replyContent.trim() || isReplying) return;

		isReplying = true;

		try {
			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					postId,
					content: replyContent.trim(),
					parentId: comment.id
				})
			});

			const result = await response.json();

			if (response.ok) {
				// For 2-level threading, always add replies to the parent callback
				// The parent component will handle placing it correctly
				onAddReply(result.comment);
				replyContent = '';
				showReplyForm = false;
			} else {
				console.error('Failed to add reply:', result.error);
			}
		} catch (error) {
			console.error('Error adding reply:', error);
		} finally {
			isReplying = false;
		}
	}

	function handleReplyClick() {
		if (!isAuthenticated) return;
		showReplyForm = !showReplyForm;
	}

	const maxDepth = 1; // Only 2 levels: 0 (top-level) and 1 (replies)
	const shouldIndent = depth > 0;
</script>

<div class={shouldIndent ? 'ml-3 border-l border-gray-200 pl-3 md:ml-6 md:pl-4' : ''}>
	<div class="flex gap-3 py-4">
		<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
			{#if comment.author.avatar}
				<img src={comment.author.avatar} alt={comment.author.name} class="h-8 w-8 rounded-full" />
			{:else}
				<span class="text-xs font-medium text-gray-600">
					{comment.author.name.slice(0, 2).toUpperCase()}
				</span>
			{/if}
		</div>

		<div class="min-w-0 flex-1">
			<div class="mb-1 flex items-center gap-2">
				<span class="text-sm font-medium">{comment.author.name}</span>
				<span class="text-xs text-gray-500">@{comment.author.username}</span>
				<span class="text-xs text-gray-500">•</span>
				<span class="text-xs text-gray-500">{comment.timestamp}</span>

				<button
					class="ml-auto flex h-6 w-6 items-center justify-center rounded p-0 hover:bg-gray-100"
				>
					<MoreHorizontal class="h-3 w-3" />
				</button>
			</div>

			<p class="mb-3 text-sm whitespace-pre-wrap">{comment.content}</p>

			<div class="flex items-center gap-4">
				<button
					type="button"
					class="flex h-7 items-center gap-1.5 rounded px-2 hover:bg-gray-100 {comment.isLiked ||
					false
						? 'text-orange-500'
						: 'text-gray-500'} {!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}"
					disabled={!isAuthenticated || isLiking}
					on:click={handleLike}
				>
					<ArrowUp class="h-3 w-3 {comment.isLiked || false ? 'fill-current' : ''}" />
					<span class="text-xs">{comment.likes}</span>
				</button>

				<button
					class="flex h-7 items-center gap-1.5 rounded px-2 text-gray-500 hover:bg-gray-100"
					on:click={handleReplyClick}
					disabled={!isAuthenticated}
				>
					<MessageCircle class="h-3 w-3" />
					<span class="text-xs">Reply</span>
				</button>

				{#if comment.replies && comment.replies.length > 0}
					<button
						class="h-7 rounded px-2 text-xs text-gray-500 hover:bg-gray-100"
						on:click={() => (showReplies = !showReplies)}
					>
						{showReplies ? 'Hide' : 'Show'}
						{comment.replies.length}{' '}
						{comment.replies.length === 1 ? 'reply' : 'replies'}
					</button>
				{/if}
			</div>

			{#if showReplyForm}
				<div class="mt-3">
					<div class="flex gap-2">
						<div
							class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200"
						>
							{#if user?.imageUrl}
								<img
									src={user.imageUrl}
									alt={user.firstName || 'User'}
									class="h-6 w-6 rounded-full"
								/>
							{:else}
								<span class="text-xs">{(user?.firstName || 'U').slice(0, 1).toUpperCase()}</span>
							{/if}
						</div>
						<div class="flex-1">
							<textarea
								bind:value={replyContent}
								placeholder="Write a reply..."
								class="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
								rows="2"
								disabled={!isAuthenticated || isReplying}
							></textarea>
							<div class="mt-2 flex gap-2">
								<button
									type="button"
									class="rounded bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50"
									disabled={!replyContent.trim() || !isAuthenticated || isReplying}
									on:click={handleReply}
								>
									{isReplying ? 'Replying...' : 'Reply'}
								</button>
								<button
									type="button"
									class="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700"
									on:click={() => (showReplyForm = false)}
									disabled={isReplying}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</div>
			{/if}

			{#if comment.replies && comment.replies.length > 0 && showReplies}
				<div class="mt-3">
					{#each comment.replies as reply (reply.id)}
						<svelte:self comment={reply} {onAddReply} depth={1} {postId} {isAuthenticated} {user} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
