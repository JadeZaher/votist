<script lang="ts">
	import type { PollFeedData, PostData, CommentData } from '$lib/types';
	import Post from './Post.svelte';
	import CommentForm from './CommentForm.svelte';
	import Comment from './Comment.svelte';
	import { ChevronDown, ChevronUp } from 'lucide-svelte';

	export let pollData: PollFeedData;
	export let isAuthenticated: boolean;
	export let user: any;

	let post: PostData = pollData.post;
	let comments: CommentData[] = pollData.comments;
	let sortBy = 'popular';
	let isDiscussionOpen = false;

	// Debug logging to see if the state is changing
	$: console.log('Discussion open state:', isDiscussionOpen);

	function handlePostLike() {
		post = {
			...post,
			isLiked: !post.isLiked,
			likes: post.isLiked ? post.likes - 1 : post.likes + 1
		};
	}

	function handlePostBookmark() {
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
		if (post.poll && !post.poll.userVote) {
			post = {
				...post,
				poll: {
					...post.poll,
					userVote: optionId,
					totalVotes: post.poll.totalVotes + 1,
					options: post.poll.options.map((option) =>
						option.id === optionId ? { ...option, votes: option.votes + 1 } : option
					)
				}
			};
		}
	}

	function handleCommentLike(commentId: string) {
		function updateCommentLike(comments: CommentData[]): CommentData[] {
			return comments.map((comment) => {
				if (comment.id === commentId) {
					return {
						...comment,
						isLiked: !comment.isLiked,
						likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
					};
				}
				if (comment.replies) {
					return {
						...comment,
						replies: updateCommentLike(comment.replies)
					};
				}
				return comment;
			});
		}

		comments = updateCommentLike(comments);
	}

	function handleAddComment(newComment: CommentData) {
		comments = [newComment, ...comments];
		post = {
			...post,
			comments: post.comments + 1
		};
	}

	function handleAddReply(parentId: string, content: string) {
		function addReplyToComment(comments: CommentData[]): CommentData[] {
			return comments.map((comment) => {
				if (comment.id === parentId) {
					const newReply: CommentData = {
						id: `r${Date.now()}`,
						author: {
							name: 'You',
							avatar: '',
							username: 'you'
						},
						content,
						timestamp: 'now',
						likes: 0,
						isLiked: false
					};

					return {
						...comment,
						replies: [...(comment.replies || []), newReply]
					};
				}
				if (comment.replies) {
					return {
						...comment,
						replies: addReplyToComment(comment.replies)
					};
				}
				return comment;
			});
		}

		comments = addReplyToComment(comments);
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
			{isAuthenticated}
			{user}
			onLike={handlePostLike}
			onBookmark={handlePostBookmark}
			onVote={handleVote}
			onDiscussionClick={handleDiscussionClick}
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
						postId={post.id}
						{isAuthenticated}
						{user}
						onAddComment={handleAddComment}
						placeholder="Share your thoughts on the poll..."
					/>

					<div class="space-y-1">
						{#each sortedComments as comment (comment.id)}
							<Comment {comment} onLike={handleCommentLike} onReply={handleAddReply} />
						{/each}
					</div>
				</div>
			{:else}
				<!-- Debug indicator -->
			{/if}
		</div>
	</div>
</div>
