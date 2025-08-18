<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CommentForm from './CommentForm.svelte';

	export let comment: {
		id: number;
		content: string;
		author: {
			name: string;
			avatar?: string;
			votingPower: number;
		};
		timestamp: string;
		votes: number;
		hasVoted: boolean;
		userVote: 'up' | 'down' | null;
		replies?: any[];
		depth: number;
	};

	const dispatch = createEventDispatcher<{
		vote: { commentId: number; voteType: 'up' | 'down' };
		reply: { parentId: number; content: string };
	}>();

	let showReplyForm = false;
	let isVoting = false;

	function handleVote(voteType: 'up' | 'down') {
		if (isVoting || comment.hasVoted) return;
		isVoting = true;
		dispatch('vote', { commentId: comment.id, voteType });
		setTimeout(() => {
			isVoting = false;
		}, 500);
	}

	function handleReply() {
		showReplyForm = !showReplyForm;
	}

	function handleReplySubmit(event: CustomEvent<{ content: string; parentId: number | null }>) {
		dispatch('reply', { parentId: comment.id, content: event.detail.content });
		showReplyForm = false;
	}

	function handleReplyCancel() {
		showReplyForm = false;
	}

	function formatTimestamp(timestamp: string): string {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

		if (diffInMinutes < 1) return 'just now';
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
		return `${Math.floor(diffInMinutes / 1440)}d ago`;
	}

	function getIndentClass(depth: number): string {
		const indentLevels = ['', 'ml-8', 'ml-16', 'ml-24', 'ml-32'];
		return indentLevels[Math.min(depth, indentLevels.length - 1)] || 'ml-32';
	}
</script>

<div class="mb-4 {getIndentClass(comment.depth)}">
	<div class="rounded-lg border border-gray-200 bg-white p-4">
		<!-- Comment Header -->
		<div class="mb-3 flex items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-[#167b9b] text-sm font-bold text-white"
				>
					{comment.author.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<div class="flex items-center gap-2">
						<span class="font-medium text-gray-800">{comment.author.name}</span>
						<span class="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
							{comment.author.votingPower} VP
						</span>
					</div>
					<div class="text-xs text-gray-500">
						{formatTimestamp(comment.timestamp)}
					</div>
				</div>
			</div>
		</div>

		<!-- Comment Content -->
		<div class="mb-3 text-gray-800">
			{comment.content}
		</div>

		<!-- Comment Actions -->
		<div class="flex items-center gap-4 text-sm">
			<!-- Vote Buttons -->
			<div class="flex items-center gap-1">
				<button
					on:click={() => handleVote('up')}
					disabled={isVoting || comment.hasVoted}
					class="flex items-center gap-1 rounded px-2 py-1 text-gray-600 hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-50
					{comment.userVote === 'up' ? 'bg-green-50 text-green-600' : ''}"
				>
					<span class="text-lg">👍</span>
					<span>{comment.votes > 0 ? comment.votes : ''}</span>
				</button>
				<button
					on:click={() => handleVote('down')}
					disabled={isVoting || comment.hasVoted}
					class="flex items-center gap-1 rounded px-2 py-1 text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50
					{comment.userVote === 'down' ? 'bg-red-50 text-red-600' : ''}"
				>
					<span class="text-lg">👎</span>
				</button>
			</div>

			<!-- Reply Button -->
			{#if comment.depth < 4}
				<button on:click={handleReply} class="text-gray-600 hover:text-[#167b9b]"> Reply </button>
			{/if}
		</div>
	</div>

	<!-- Reply Form -->
	{#if showReplyForm}
		<CommentForm
			placeholder="Write a reply..."
			isReply={true}
			parentId={comment.id}
			on:submit={handleReplySubmit}
			on:cancel={handleReplyCancel}
		/>
	{/if}

	<!-- Nested Replies -->
	{#if comment.replies && comment.replies.length > 0}
		<div class="mt-3">
			{#each comment.replies as reply}
				<svelte:self comment={reply} on:vote on:reply />
			{/each}
		</div>
	{/if}
</div>
