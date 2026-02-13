<script lang="ts">
	import type { CommentData } from '$lib/types';
	import { MoreHorizontal, ArrowUp, MessageCircle, Pencil, Trash2 } from 'lucide-svelte';

	export let comment: CommentData;
	export let onAddReply: (reply: CommentData) => void;
	export let onDelete: (commentId: string) => void;
	export let onEdit: (commentId: string, newContent: string) => void;
	export let depth = 0;
	export let postId: string;
	export let isAuthenticated: boolean;
	export let user: any;
	export let replyingToName: string | null = null;

	const EDIT_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

	let showReplyForm = false;
	let replyContent = '';
	let showReplies = true;
	let isLiking = false;
	let isReplying = false;
	let showMenu = false;
	let isEditing = false;
	let editContent = '';
	let isDeleting = false;
	let isSavingEdit = false;

	// Check if current user owns this comment
	$: isOwner = (() => {
		if (!isAuthenticated || !user) return false;
		const userName =
			user.firstName && user.lastName
				? `${user.firstName} ${user.lastName}`
				: user.firstName || '';
		return comment.author.name === userName;
	})();

	// Check if still within 2-min edit window
	$: canEdit = (() => {
		if (!isOwner) return false;
		// Temp/optimistic comments are always editable
		if (comment.id.startsWith('temp-')) return true;
		const elapsed = Date.now() - new Date(comment.timestamp).getTime();
		return elapsed < EDIT_WINDOW_MS;
	})();

	$: canDelete = isOwner;

	function formatTimestamp(ts: string) {
		const date = new Date(ts);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMin = Math.floor(diffMs / 60000);
		if (diffMin < 1) return 'just now';
		if (diffMin < 60) return `${diffMin}m ago`;
		const diffHours = Math.floor(diffMin / 60);
		if (diffHours < 24) return `${diffHours}h ago`;
		const diffDays = Math.floor(diffHours / 24);
		if (diffDays < 30) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	}

	async function handleLike() {
		if (!isAuthenticated || isLiking) return;

		const prevIsLiked = comment.isLiked || false;
		const prevLikes = comment.likes;
		comment.isLiked = !prevIsLiked;
		comment.likes = prevIsLiked ? comment.likes - 1 : comment.likes + 1;
		isLiking = true;

		try {
			const response = await fetch(`/api/comments/${comment.id}/like`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			});
			const result = await response.json();
			if (response.ok) {
				comment.likes = result.likes;
				comment.isLiked = result.isLiked;
			} else {
				comment.isLiked = prevIsLiked;
				comment.likes = prevLikes;
			}
		} catch {
			comment.isLiked = prevIsLiked;
			comment.likes = prevLikes;
		} finally {
			isLiking = false;
		}
	}

	async function handleReply() {
		if (!isAuthenticated || !replyContent.trim() || isReplying) return;

		const replyText = replyContent.trim();
		const rootId = comment.rootCommentId || comment.id;
		const optimisticReply: CommentData = {
			id: `temp-${Date.now()}`,
			author: {
				name:
					user?.firstName && user?.lastName
						? `${user.firstName} ${user.lastName}`
						: user?.firstName || 'You',
				avatar: user?.imageUrl || '',
				username: user?.email?.split('@')[0] || 'you'
			},
			content: replyText,
			timestamp: new Date().toISOString(),
			likes: 0,
			isLiked: false,
			replies: [],
			rootCommentId: rootId,
			parentId: comment.id
		};

		onAddReply(optimisticReply);
		replyContent = '';
		showReplyForm = false;
		isReplying = true;

		try {
			const response = await fetch(`/api/posts/${postId}/comments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: replyText, parentId: comment.id })
			});
			const result = await response.json();
			if (!response.ok) {
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

	function startEdit() {
		editContent = comment.content;
		isEditing = true;
		showMenu = false;
	}

	async function saveEdit() {
		if (!editContent.trim() || isSavingEdit) return;
		const newContent = editContent.trim();
		if (newContent === comment.content) {
			isEditing = false;
			return;
		}

		// Optimistic update
		onEdit(comment.id, newContent);
		isEditing = false;
		isSavingEdit = true;

		try {
			const response = await fetch(`/api/comments/${comment.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ content: newContent })
			});
			if (!response.ok) {
				const result = await response.json();
				console.error('Failed to edit comment:', result.error);
				// Revert
				onEdit(comment.id, comment.content);
			}
		} catch (error) {
			console.error('Error editing comment:', error);
			onEdit(comment.id, comment.content);
		} finally {
			isSavingEdit = false;
		}
	}

	async function handleDelete() {
		if (isDeleting) return;
		showMenu = false;

		// Optimistic removal
		onDelete(comment.id);
		isDeleting = true;

		try {
			const response = await fetch(`/api/comments/${comment.id}`, {
				method: 'DELETE'
			});
			if (!response.ok) {
				const result = await response.json();
				console.error('Failed to delete comment:', result.error);
			}
		} catch (error) {
			console.error('Error deleting comment:', error);
		} finally {
			isDeleting = false;
		}
	}

	const shouldIndent = depth > 0;
</script>

<svelte:window on:click={() => (showMenu = false)} />

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
				<span class="text-xs text-gray-500">&middot;</span>
				<span class="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>

				{#if isOwner}
					<div class="relative ml-auto">
						<button
							class="flex h-6 w-6 items-center justify-center rounded p-0 hover:bg-gray-100"
							on:click|stopPropagation={() => (showMenu = !showMenu)}
						>
							<MoreHorizontal class="h-3 w-3" />
						</button>

						{#if showMenu}
							<div class="absolute right-0 z-10 mt-1 w-32 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
								{#if canEdit}
									<button
										class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
										on:click|stopPropagation={startEdit}
									>
										<Pencil class="h-3 w-3" />
										Edit
									</button>
								{/if}
								{#if canDelete}
									<button
										class="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
										on:click|stopPropagation={handleDelete}
									>
										<Trash2 class="h-3 w-3" />
										Delete
									</button>
								{/if}
							</div>
						{/if}
					</div>
				{:else}
					<button
						class="ml-auto flex h-6 w-6 items-center justify-center rounded p-0 hover:bg-gray-100"
					>
						<MoreHorizontal class="h-3 w-3" />
					</button>
				{/if}
			</div>

			{#if replyingToName}
				<span class="mb-1 inline-flex items-center gap-1 text-xs text-[#167b9b]">
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a5 5 0 015 5v6M3 10l6 6M3 10l6-6" />
					</svg>
					Replying to <span class="font-medium">@{replyingToName}</span>
				</span>
			{/if}

			{#if isEditing}
				<div class="mb-3">
					<textarea
						bind:value={editContent}
						class="w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
						rows="3"
					></textarea>
					<div class="mt-2 flex gap-2">
						<button
							type="button"
							class="rounded bg-[#167b9b] px-3 py-1 text-sm text-white disabled:opacity-50"
							disabled={!editContent.trim() || isSavingEdit}
							on:click={saveEdit}
						>
							Save
						</button>
						<button
							type="button"
							class="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700"
							on:click={() => (isEditing = false)}
						>
							Cancel
						</button>
					</div>
				</div>
			{:else}
				<p class="mb-3 text-sm whitespace-pre-wrap">{comment.content}</p>
			{/if}

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
						{@const replyTo =
							reply.parentId && reply.parentId !== comment.id
								? comment.replies?.find((r) => r.id === reply.parentId)?.author?.name ||
									comment.author.name
								: null}
						<svelte:self
							comment={reply}
							{onAddReply}
							{onDelete}
							{onEdit}
							replyingToName={replyTo}
							depth={1}
							{postId}
							{isAuthenticated}
							{user}
						/>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
