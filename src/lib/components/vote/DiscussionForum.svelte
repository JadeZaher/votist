<script lang="ts">
	import type { PollFeedData, PostData, CommentData, Poll } from '$lib/types';
	import { enhance } from '$app/forms';
	import Post from './Post.svelte';
	import CommentForm from './CommentForm.svelte';
	import Comment from './Comment.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	export let pollData: PollFeedData;
	export let isAuthenticated: boolean;
	export let user: any;

	let post: PostData = pollData.post;
	let comments: CommentData[] = pollData.comments;

	// Helper function to calculate if user has liked an item
	function calculateIsLiked(itemId: string, itemType: 'post' | 'comment'): boolean {
		if (!isAuthenticated || !user) return false;
		// This would be calculated based on user's like relationships
		// For now, use the existing isLiked value if available
		return false; // Will be calculated dynamically
	}
	let sortBy = 'popular';
	let isDiscussionOpen = false;

	let isVoting = false;
	let isAddingComment = false;
	let isLikingPost = false;
	let isLikingComment = false;

	let revertPostLike: { prevIsLiked: boolean; prevLikes: number } | null = null;
	let postDelta: number;

	// Debug logging to see if the state is changing
	$: console.log('Discussion open state:', isDiscussionOpen);

	function handlePostLike() {
		if (!isAuthenticated || isLikingPost) return;
		const currentIsLiked = post.isLiked || false;
		revertPostLike = { prevIsLiked: currentIsLiked, prevLikes: post.likes };
		postDelta = currentIsLiked ? -1 : 1;
		post.isLiked = !currentIsLiked;
		post.likes += postDelta;
		isLikingPost = true;
	}

	// Simplified post like handling

	function handlePostBookmark() {
		if (!isAuthenticated) return;
		post = {
			...post,
			isBookmarked: !post.isBookmarked
		};
	}

	function handleDiscussionClick() {
		console.log('Discussion click handler called, current state:', isDiscussionOpen);
		isDiscussionOpen = !isDiscussionOpen;
		console.log('New state:', isDiscussionOpen);
	}

	function handleVote(optionId: string) {
		// This function now just passes the vote to the Post component
		// The Post component handles the actual form submission and backend call
		if (!isAuthenticated || !post.poll || post.poll.userVote) return;

		// The Post component will handle the optimistic update and form submission
		// This function is now mainly a pass-through
	}

	function handleCommentLike(commentId: string) {
		// This function is now handled directly by the Comment component
		// but we keep it for backward compatibility if needed
		return;
	}

	function handleAddComment(comment: CommentData) {
		if (!isAuthenticated) return;

		// Add the new comment to the beginning of the comments array
		comments = [comment, ...comments];
		post = {
			...post,
			comments: post.comments + 1
		};
	}

	function handleAddReply(reply: CommentData) {
		if (!isAuthenticated) return;

		// Find the root comment this reply belongs to
		const targetRootId = reply.rootCommentId;

		if (targetRootId) {
			// Add to the specific root comment's replies
			comments = comments.map((comment) => {
				if (comment.id === targetRootId) {
					return {
						...comment,
						replies: comment.replies ? [...comment.replies, reply] : [reply]
					};
				}
				return comment;
			});
		} else {
			// This is a top-level comment, add to main comments array
			comments = [reply, ...comments];
		}

		// Update post comment count
		post = {
			...post,
			comments: post.comments + 1
		};
	}

	$: sortedComments = [...comments].sort((a, b) => {
		if (sortBy === 'popular') {
			return b.likes - a.likes;
		} else if (sortBy === 'newest') {
			return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
		} else {
			return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
		}
	});
</script>

<div class="rounded-lg border border-gray-200 bg-white">
	<div class="p-6">
		<Post
			{post}
			onLike={handlePostLike}
			onBookmark={handlePostBookmark}
			onDiscussionClick={handleDiscussionClick}
			{isAuthenticated}
			{user}
		/>

		<!-- Discussion Toggle -->
		<div class="mt-6 border-t border-gray-200 pt-6">
			<button
				type="button"
				class="flex h-auto w-full items-center justify-between rounded-md p-3 text-left hover:bg-gray-50"
				on:click={handleDiscussionClick}
			>
				<span class="flex items-center gap-2">
					<h3 class="font-medium">Discussion</h3>
					<span class="text-sm text-gray-500">({post.comments})</span>
				</span>
				{#if isDiscussionOpen}
					<ChevronUp class="h-4 w-4 text-gray-500" />
				{:else}
					<ChevronDown class="h-4 w-4 text-gray-500" />
				{/if}
			</button>

			{#if isDiscussionOpen}
				<div class="mt-4 space-y-6">
					<div class="flex items-center justify-end">
						<select
							bind:value={sortBy}
							class="w-40 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
						>
							<option value="popular">Most Popular</option>
							<option value="newest">Newest First</option>
							<option value="oldest">Oldest First</option>
						</select>
					</div>

					<CommentForm
						onAddComment={handleAddComment}
						placeholder="Share your thoughts on the poll..."
						{isAuthenticated}
						{user}
						postId={post.id}
					/>

					<div class="space-y-1">
						{#each sortedComments as comment (comment.id)}
							<Comment
								{comment}
								onLike={handleCommentLike}
								onAddReply={handleAddReply}
								{isAuthenticated}
								{user}
								postId={post.id}
							/>
						{/each}
					</div>
				</div>
			{:else}
				<!-- Debug indicator -->
			{/if}
		</div>
	</div>
</div>
