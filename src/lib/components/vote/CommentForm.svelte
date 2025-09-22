<script lang="ts">
	import type { CommentData } from '$lib/types';

	export let postId: string;
	export let placeholder = 'Share your thoughts...';
	export let parentId: string | null = null;
	export let isAuthenticated: boolean;
	export let user: any;
	export let onAddComment: (comment: CommentData) => void;

	let content = '';
	let isFocused = false;
	let isSubmitting = false;

	async function handleSubmit() {
		if (!isAuthenticated || !content.trim() || isSubmitting) return;

		isSubmitting = true;

		try {
			const response = await fetch('/api/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					postId,
					content: content.trim(),
					parentId
				})
			});

			const result = await response.json();

			if (response.ok) {
				onAddComment(result.comment);
				content = '';
				isFocused = false;
			} else {
				console.error('Failed to add comment:', result.error);
			}
		} catch (error) {
			console.error('Error adding comment:', error);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4">
	<div class="flex gap-3">
		<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
			{#if user?.imageUrl}
				<img src={user.imageUrl} alt={user.firstName || 'User'} class="h-10 w-10 rounded-full" />
			{:else}
				<span class="text-sm font-medium text-gray-600">
					{(user?.firstName || 'You').slice(0, 2).toUpperCase()}
				</span>
			{/if}
		</div>

		<div class="flex-1">
			<textarea
				bind:value={content}
				on:focus={() => (isFocused = true)}
				{placeholder}
				class="min-h-[80px] w-full resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
				disabled={!isAuthenticated || isSubmitting}
			></textarea>

			{#if isFocused || content}
				<div class="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
					<div class="text-xs text-gray-500">
						{content.length}/2000 characters
					</div>

					<div class="flex gap-2">
						<button
							type="button"
							class="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700"
							on:click={() => {
								content = '';
								isFocused = false;
							}}
							disabled={!isAuthenticated || isSubmitting}
						>
							Cancel
						</button>
						<button
							type="button"
							class="rounded bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50"
							disabled={!content.trim() || !isAuthenticated || isSubmitting}
							on:click={handleSubmit}
						>
							{isSubmitting ? 'Posting...' : 'Comment'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
