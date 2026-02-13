<script lang="ts">
	import type { CommentData } from '$lib/types';
	import Post from '$lib/components/vote/Post.svelte';
	import Comment from '$lib/components/vote/Comment.svelte';
	import logo from '$lib/assets/logo/logo-header.png';

	export let data;

	const post = data.post;
	const comments: CommentData[] = data.comments;

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

	// No-ops for read-only mode
	function noop() {}
	function noopReply(_reply: CommentData) {}
	function noopDelete(_id: string) {}
	function noopEdit(_id: string, _content: string) {}
</script>

<svelte:head>
	<title>{post.title} - Votist</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Join CTA Banner -->
	<div class="border-b border-[#167b9b]/20 bg-gradient-to-r from-[#167b9b] to-[#0891B2]">
		<div class="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 md:px-6">
			<div class="flex items-center gap-3">
				<img src={logo} alt="Votist" class="h-7" />
				<span class="hidden text-sm text-white/90 sm:inline">
					Civic engagement starts with informed participation
				</span>
			</div>
			<a
				href="/sign-up"
				class="rounded-lg bg-white px-4 py-1.5 text-sm font-medium text-[#167b9b] shadow-sm transition hover:bg-gray-50"
			>
				Join Votist
			</a>
		</div>
	</div>

	<!-- San Rafael / Location CTA -->
	<div class="border-b border-amber-200 bg-amber-50">
		<div class="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 md:px-6">
			<svg class="h-5 w-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
			<p class="flex-1 text-sm text-amber-800">
				<strong>San Rafael resident?</strong> Your voice matters. Join Votist to vote on local issues, take quizzes to earn voting power, and shape your community's future.
			</p>
			<a
				href="/sign-up"
				class="flex-shrink-0 rounded-lg bg-[#167b9b] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#125a74]"
			>
				Get Started
			</a>
		</div>
	</div>

	<!-- Post Content -->
	<div class="mx-auto max-w-4xl px-3 py-6 md:px-4 md:py-8">
		<div class="rounded-lg border border-gray-200 bg-white p-4 md:p-6">
			<Post
				{post}
				isAuthenticated={false}
				onDiscussionClick={noop}
				readOnly={true}
			/>

			<!-- Comments Section -->
			{#if comments.length > 0}
				<div class="mt-6 border-t border-gray-200 pt-6">
					<h3 class="mb-4 font-medium">
						Discussion <span class="text-sm text-gray-500">({post.comments})</span>
					</h3>

					<div class="space-y-1">
						{#each comments as comment (comment.id)}
							{@const replies = comment.replies || []}
							<div class="rounded-lg bg-gray-50 px-3 py-2">
								<div class="flex gap-3 py-2">
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
											<span class="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
										</div>
										<p class="text-sm whitespace-pre-wrap">{comment.content}</p>
										<div class="mt-1 flex items-center gap-3 text-xs text-gray-500">
											<span>{comment.likes} likes</span>
											{#if replies.length > 0}
												<span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
											{/if}
										</div>
									</div>
								</div>

								{#if replies.length > 0}
									<div class="ml-6 space-y-1 border-l border-gray-200 pl-4 md:ml-8">
										{#each replies as reply (reply.id)}
											{@const replyTo =
												reply.parentId && reply.parentId !== comment.id
													? replies.find((r) => r.id === reply.parentId)?.author?.name || comment.author.name
													: null}
											<div class="flex gap-2 py-2">
												<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
													{#if reply.author.avatar}
														<img src={reply.author.avatar} alt={reply.author.name} class="h-6 w-6 rounded-full" />
													{:else}
														<span class="text-[10px] font-medium text-gray-600">
															{reply.author.name.slice(0, 2).toUpperCase()}
														</span>
													{/if}
												</div>
												<div class="min-w-0 flex-1">
													<div class="mb-0.5 flex items-center gap-2">
														<span class="text-xs font-medium">{reply.author.name}</span>
														<span class="text-[10px] text-gray-500">{formatTimestamp(reply.timestamp)}</span>
													</div>
													{#if replyTo}
														<span class="mb-0.5 inline-flex items-center gap-1 text-[10px] text-[#167b9b]">
															Replying to @{replyTo}
														</span>
													{/if}
													<p class="text-xs whitespace-pre-wrap">{reply.content}</p>
													<span class="text-[10px] text-gray-500">{reply.likes} likes</span>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<!-- Bottom CTA -->
		<div class="mt-6 rounded-lg border border-[#167b9b]/20 bg-white p-6 text-center md:p-8">
			<img src={logo} alt="Votist" class="mx-auto mb-4 h-8" />
			<h2 class="mb-2 text-xl font-bold text-gray-900">Want to join the conversation?</h2>
			<p class="mx-auto mb-6 max-w-lg text-gray-600">
				Votist is a civic engagement platform where informed citizens vote on real community issues.
				Complete quizzes, earn voting power, and make your voice count.
			</p>
			<div class="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
				<a
					href="/sign-up"
					class="w-full rounded-lg bg-[#167b9b] px-6 py-2.5 font-medium text-white transition hover:bg-[#125a74] sm:w-auto"
				>
					Create Account
				</a>
				<a
					href="/sign-in"
					class="w-full rounded-lg border border-gray-300 bg-white px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
				>
					Sign In
				</a>
			</div>
		</div>
	</div>
</div>
