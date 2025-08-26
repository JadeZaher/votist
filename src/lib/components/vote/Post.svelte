<script lang="ts">
	import type { PostData } from '$lib/types';
	import {
		MoreHorizontal,
		ArrowUp,
		MessageCircle,
		Share,
		Bookmark,
		BarChart3
	} from 'lucide-svelte';

	export let post: PostData;
	export let onLike: () => void;
	export let onBookmark: () => void;
	export let onVote: (optionId: string) => void;
	export let onDiscussionClick: () => void;

	function handleVote(optionId: string) {
		if (!post.poll?.userVote) {
			onVote(optionId);
		}
	}

	function getPercentage(votes: number, total: number) {
		if (total === 0) return 0;
		return Math.round((votes / total) * 100);
	}
</script>

<div>
	<div class="mb-4 flex items-start gap-4">
		<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
			{#if post.author.avatar}
				<img src={post.author.avatar} alt={post.author.name} class="h-12 w-12 rounded-full" />
			{:else}
				<span class="text-sm font-medium text-gray-600">
					{post.author.name.slice(0, 2).toUpperCase()}
				</span>
			{/if}
		</div>

		<div class="min-w-0 flex-1">
			<div class="mb-1 flex items-center gap-2">
				<h3 class="font-medium">{post.author.name}</h3>
				<span class="text-sm text-gray-500">@{post.author.username}</span>
				{#if post.author.isVerified}
					<div class="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
						<div class="h-2 w-2 rounded-full bg-white"></div>
					</div>
				{/if}
			</div>
			<div class="flex items-center gap-2 text-sm text-gray-500">
				<span>{post.timestamp}</span>
				<span>•</span>
				<span class="rounded bg-gray-100 px-2 py-1 text-xs">{post.category}</span>
			</div>
		</div>

		<button class="flex h-8 w-8 items-center justify-center rounded p-0 hover:bg-gray-100">
			<MoreHorizontal class="h-4 w-4" />
		</button>
	</div>

	<div class="mb-4">
		<h1 class="mb-3 text-xl font-semibold">{post.title}</h1>
		<div class="prose prose-sm max-w-none">
			<p class="whitespace-pre-wrap text-gray-700">{post.content}</p>
		</div>
	</div>

	<!-- Poll Section -->
	{#if post.poll}
		<div class="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
			<div class="mb-4 flex items-center gap-2">
				<BarChart3 class="h-4 w-4 text-gray-500" />
				<span class="text-sm font-medium">Poll</span>
				{#if post.poll.endsAt}
					<span class="text-xs text-gray-500">• Ends {post.poll.endsAt}</span>
				{/if}
			</div>

			<h3 class="mb-4 font-medium">{post.poll.question}</h3>

			<div class="space-y-3">
				{#each post.poll.options as option}
					{@const percentage = getPercentage(option.votes, post.poll!.totalVotes)}
					{@const isSelected = post.poll?.userVote === option.id}
					{@const hasVoted = !!post.poll?.userVote}

					<div class="space-y-2">
						<button
							class="h-auto w-full justify-start overflow-hidden rounded-md border p-0 {hasVoted
								? 'cursor-default'
								: 'cursor-pointer hover:bg-gray-50'} {isSelected
								? 'border-blue-500 bg-blue-50'
								: 'border-gray-200'}"
							on:click={() => handleVote(option.id)}
							disabled={hasVoted}
						>
							<div class="relative w-full p-3">
								{#if hasVoted}
									<div
										class="absolute inset-0 transition-all duration-500 {isSelected
											? 'bg-blue-200'
											: 'bg-gray-200'}"
										style="width: {percentage}%"
									></div>
								{/if}
								<div class="relative flex items-center justify-between">
									<span class="text-left">{option.text}</span>
									{#if hasVoted}
										<div class="flex items-center gap-2 text-sm">
											<span>{percentage}%</span>
											<span class="text-gray-500">({option.votes})</span>
										</div>
									{/if}
								</div>
							</div>
						</button>
					</div>
				{/each}
			</div>

			<div class="mt-4 border-t border-gray-200 pt-3">
				<div class="flex items-center justify-between text-sm text-gray-500">
					<span>{post.poll.totalVotes} {post.poll.totalVotes === 1 ? 'vote' : 'votes'}</span>
					{#if !post.poll.userVote}
						<span>Choose an option to see results</span>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	{#if post.tags.length > 0}
		<div class="mb-4 flex flex-wrap gap-2">
			{#each post.tags as tag}
				<span class="rounded border bg-gray-100 px-2 py-1 text-xs">#{tag}</span>
			{/each}
		</div>
	{/if}

	<div class="flex items-center justify-between">
		<div class="flex items-center gap-6">
			<button
				class="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-100 {post.isLiked
					? 'text-orange-500'
					: 'text-gray-500'}"
				on:click={onLike}
			>
				<ArrowUp class="h-4 w-4 {post.isLiked ? 'fill-current' : ''}" />
				<span>{post.likes}</span>
			</button>

			<button
				class="flex items-center gap-2 rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
				on:click={onDiscussionClick}
			>
				<MessageCircle class="h-4 w-4" />
				<span>{post.comments}</span>
			</button>
		</div>

		<div class="flex items-center gap-2">
			<button class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
				<Share class="h-4 w-4" />
			</button>

			<button
				class="rounded p-1 hover:bg-gray-100 {post.isBookmarked
					? 'text-blue-500'
					: 'text-gray-500'}"
				on:click={onBookmark}
			>
				<Bookmark class="h-4 w-4 {post.isBookmarked ? 'fill-current' : ''}" />
			</button>
		</div>
	</div>
</div>
