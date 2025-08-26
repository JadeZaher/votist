<script lang="ts">
	import type { CommentData } from '$lib/types';
	import { MoreHorizontal, ArrowUp, MessageCircle } from 'lucide-svelte';

	export let comment: CommentData;
	export let onLike: (commentId: string) => void;
	export let onReply: (commentId: string, content: string) => void;
	export let depth = 0;

	let showReplyForm = false;
	let replyContent = '';
	let showReplies = true;

	function handleReplySubmit(e: Event) {
		e.preventDefault();
		if (replyContent.trim()) {
			onReply(comment.id, replyContent);
			replyContent = '';
			showReplyForm = false;
		}
	}

	const maxDepth = 3;
	const shouldIndent = depth < maxDepth;
</script>

<div class={shouldIndent ? 'ml-6 border-l border-gray-200 pl-4' : ''}>
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
					class="flex h-7 items-center gap-1.5 rounded px-2 hover:bg-gray-100 {comment.isLiked
						? 'text-orange-500'
						: 'text-gray-500'}"
					on:click={() => onLike(comment.id)}
				>
					<ArrowUp class="h-3 w-3 {comment.isLiked ? 'fill-current' : ''}" />
					<span class="text-xs">{comment.likes}</span>
				</button>

				<button
					class="flex h-7 items-center gap-1.5 rounded px-2 text-gray-500 hover:bg-gray-100"
					on:click={() => (showReplyForm = !showReplyForm)}
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
				<form on:submit={handleReplySubmit} class="mt-3">
					<div class="flex gap-2">
						<div
							class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200"
						>
							<span class="text-xs">U</span>
						</div>
						<div class="flex-1">
							<textarea
								bind:value={replyContent}
								placeholder="Write a reply..."
								class="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
								rows="2"
							/>
							<div class="mt-2 flex gap-2">
								<button
									type="submit"
									class="rounded bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50"
									disabled={!replyContent.trim()}
								>
									Reply
								</button>
								<button
									type="button"
									class="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700"
									on:click={() => (showReplyForm = false)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				</form>
			{/if}

			{#if comment.replies && comment.replies.length > 0 && showReplies}
				<div class="mt-3">
					{#each comment.replies as reply (reply.id)}
						<svelte:self {reply} {onLike} {onReply} depth={depth + 1} />
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
