<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let placeholder: string = 'Share your thoughts...';
	export let isReply: boolean = false;
	export let parentId: number | null = null;

	const dispatch = createEventDispatcher<{
		submit: { content: string; parentId: number | null };
		cancel: void;
	}>();

	let content = '';
	let isSubmitting = false;

	function handleSubmit() {
		if (!content.trim() || isSubmitting) return;

		isSubmitting = true;
		dispatch('submit', { content: content.trim(), parentId });
		content = '';
		isSubmitting = false;
	}

	function handleCancel() {
		content = '';
		dispatch('cancel');
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 {isReply ? 'mt-3 ml-8' : 'mb-6'}">
	<textarea
		bind:value={content}
		{placeholder}
		rows="3"
		class="w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-[#167b9b] focus:ring-1 focus:ring-[#167b9b] focus:outline-none"
	></textarea>

	<div class="mt-3 flex items-center justify-between">
		<div class="text-xs text-gray-500">
			{#if isReply}
				Replying to comment
			{:else}
				Join the assembly discussion
			{/if}
		</div>

		<div class="flex gap-2">
			{#if isReply}
				<button
					on:click={handleCancel}
					class="rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
				>
					Cancel
				</button>
			{/if}
			<button
				on:click={handleSubmit}
				disabled={!content.trim() || isSubmitting}
				class="rounded-md bg-[#167b9b] px-4 py-1 text-sm text-white hover:bg-[#155e75] disabled:cursor-not-allowed disabled:opacity-50"
			>
				{isSubmitting ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
			</button>
		</div>
	</div>
</div>
