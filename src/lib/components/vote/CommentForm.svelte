<script lang="ts">
	export let onSubmit: (content: string) => void;
	export let placeholder = 'Share your thoughts...';

	let content = '';
	let isFocused = false;

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (content.trim()) {
			onSubmit(content);
			content = '';
			isFocused = false;
		}
	}
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4">
	<form on:submit={handleSubmit}>
		<div class="flex gap-3">
			<div
				class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-200"
			>
				<span class="text-sm font-medium text-gray-600">YU</span>
			</div>

			<div class="flex-1">
				<textarea
					bind:value={content}
					on:focus={() => (isFocused = true)}
					{placeholder}
					class="min-h-[80px] w-full resize-none border-0 bg-transparent p-0 focus-visible:ring-0"
				/>

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
							>
								Cancel
							</button>
							<button
								type="submit"
								class="rounded bg-blue-500 px-3 py-1 text-sm text-white disabled:opacity-50"
								disabled={!content.trim()}
							>
								Comment
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</form>
</div>
