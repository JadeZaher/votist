<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher<{
		saved: void;
		cancel: void;
		error: { message: string };
	}>();

	// Hardcoded categories as requested
	const categories = [
		'General Discussion',
		'Policy & Governance',
		'Community Issues',
		'Local Development',
		'Environment',
		'Education',
		'Healthcare',
		'Transportation',
		'Housing',
		'Public Safety',
		'Technology',
		'Economy',
		'Culture & Arts',
		'Sports & Recreation',
		'Other'
	];

	let title = '';
	let content = '';
	let category = categories[0];
	let tags: string[] = [];
	let tagInput = '';

	// Poll-related fields
	let includePoll = false;
	let pollQuestion = '';
	let pollOptions: string[] = ['', ''];
	let pollEndsAt = '';
	let pollRequiredDifficulty: 'VOTIST' | 'SCHOLAR' | 'MENTOR' | null = null;

	function addTag() {
		const tag = tagInput.trim();
		if (tag && !tags.includes(tag)) {
			tags = [...tags, tag];
			tagInput = '';
		}
	}

	function removeTag(tagToRemove: string) {
		tags = tags.filter((tag) => tag !== tagToRemove);
	}

	function addPollOption() {
		pollOptions = [...pollOptions, ''];
	}

	function removePollOption(index: number) {
		if (pollOptions.length > 2) {
			pollOptions = pollOptions.filter((_, i) => i !== index);
		}
	}

	function updatePollOption(index: number, value: string) {
		pollOptions = pollOptions.map((option, i) => (i === index ? value : option));
	}

	async function handleSubmit() {
		if (!title.trim() || !content.trim()) {
			showToast('Title and content are required', 'error');
			return;
		}

		if (includePoll && (!pollQuestion.trim() || pollOptions.some((opt) => !opt.trim()))) {
			showToast('Poll question and all options are required when including a poll', 'error');
			return;
		}

		try {
			const postData: any = {
				title: title.trim(),
				content: content.trim(),
				category,
				tags
			};

			if (includePoll) {
				postData.poll = {
					question: pollQuestion.trim(),
					options: pollOptions.filter((opt) => opt.trim()).map((opt) => ({ text: opt.trim() })),
					endsAt: pollEndsAt ? new Date(pollEndsAt).toISOString() : null,
					requiredDifficulty: pollRequiredDifficulty
				};
			}

			const response = await fetch('/api/posts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(postData)
			});

			if (response.ok) {
				dispatch('saved');
				// Redirect to posts page with success message
				goto('/admin/posts?success=Post created successfully!');
			} else {
				const error = await response.text();
				console.error('Error creating post:', error);
				showToast('Failed to create post. Please try again.', 'error');
				dispatch('error', { message: error });
			}
		} catch (error) {
			showToast('Error saving post', 'error');
			console.error('Error:', error);
		}
	}

	function showToast(message: string, type: 'success' | 'error' = 'success') {
		const toast = document.createElement('div');
		toast.className = `toast toast-end`;
		toast.innerHTML = `
            <div class="alert ${type === 'success' ? 'alert-success' : 'alert-error'}">
                <span>${message}</span>
            </div>
        `;
		document.body.appendChild(toast);
		setTimeout(() => toast.remove(), 3000);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<div class="form-control w-full">
		<label class="label" for="title">
			<span class="label-text font-semibold">Post Title</span>
		</label>
		<input
			id="title"
			type="text"
			class="input input-bordered w-full text-lg"
			bind:value={title}
			required
			placeholder="Enter a compelling title for your post..."
		/>
		<div class="label">
			<span class="label-text-alt text-gray-500">
				Make your title clear and engaging to attract readers.
			</span>
		</div>
	</div>

	<div class="form-control w-full">
		<label class="label" for="content">
			<span class="label-text font-semibold">Post Content</span>
		</label>
		<textarea
			id="content"
			class="textarea textarea-bordered min-h-[200px] w-full resize-y"
			bind:value={content}
			required
			placeholder="Write your post content here... Share your thoughts, ideas, or questions with the community."
		></textarea>
		<div class="label">
			<span class="label-text-alt text-gray-500">
				Write engaging content that encourages discussion and community participation.
			</span>
		</div>
	</div>

	<div class="form-control w-full max-w-xs">
		<label class="label" for="category">
			<span class="label-text">Category</span>
		</label>
		<select id="category" class="select select-bordered w-full" bind:value={category} required>
			{#each categories as cat}
				<option value={cat}>{cat}</option>
			{/each}
		</select>
	</div>

	<div class="form-control w-full">
		<label class="label" for="tags">
			<span class="label-text">Tags</span>
		</label>
		<div class="join w-full">
			<input
				id="tags"
				type="text"
				class="input input-bordered join-item flex-1"
				bind:value={tagInput}
				placeholder="Add a tag"
				on:keydown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
			/>
			<button type="button" class="btn btn-primary join-item" on:click={addTag}> Add Tag </button>
		</div>
		{#if tags.length > 0}
			<div class="mt-2 flex flex-wrap gap-2">
				{#each tags as tag}
					<div class="badge badge-primary gap-2">
						{tag}
						<button
							type="button"
							class="btn btn-xs btn-circle btn-ghost"
							on:click={() => removeTag(tag)}
						>
							×
						</button>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<div class="divider">Optional Poll</div>

	<div class="form-control">
		<label class="label cursor-pointer">
			<span class="label-text">Include a poll with this post</span>
			<input type="checkbox" class="checkbox checkbox-primary" bind:checked={includePoll} />
		</label>
	</div>

	{#if includePoll}
		<div class="card bg-base-200 space-y-4 p-4">
			<div class="form-control">
				<label class="label" for="poll-question">
					<span class="label-text">Poll Question</span>
				</label>
				<input
					id="poll-question"
					type="text"
					class="input input-bordered w-full"
					bind:value={pollQuestion}
					placeholder="What is your opinion on..."
				/>
			</div>

			<div class="form-control">
				<label class="label" for="poll-options">
					<span class="label-text">Poll Options</span>
				</label>
				{#each pollOptions as option, index}
					<div class="join mb-2">
						<input
							type="text"
							class="input input-bordered join-item flex-1"
							bind:value={pollOptions[index]}
							placeholder="Option {index + 1}"
						/>
						{#if pollOptions.length > 2}
							<button
								type="button"
								class="btn btn-error join-item"
								on:click={() => removePollOption(index)}
							>
								×
							</button>
						{/if}
					</div>
				{/each}
				<button type="button" class="btn btn-sm btn-outline" on:click={addPollOption}>
					Add Option
				</button>
			</div>

			<div class="form-control">
				<label class="label" for="poll-ends">
					<span class="label-text">Poll End Date (optional)</span>
				</label>
				<input
					id="poll-ends"
					type="datetime-local"
					class="input input-bordered w-full"
					bind:value={pollEndsAt}
				/>
			</div>

			<div class="form-control">
				<label class="label" for="poll-difficulty">
					<span class="label-text">Required Quiz Difficulty (optional)</span>
				</label>
				<select
					id="poll-difficulty"
					class="select select-bordered w-full"
					bind:value={pollRequiredDifficulty}
				>
					<option value={null}>No requirement</option>
					<option value="VOTIST">VOTIST - Basic level</option>
					<option value="SCHOLAR">SCHOLAR - Intermediate level</option>
					<option value="MENTOR">MENTOR - Advanced level</option>
				</select>
				<div class="label">
					<span class="label-text-alt text-gray-500">
						Users must complete at least one quiz of this difficulty level to vote.
					</span>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex justify-between">
		<div></div>
		<div class="join">
			<button type="button" class="btn join-item" on:click={() => dispatch('cancel')}>
				Cancel
			</button>
			<button type="submit" class="btn btn-primary join-item">Create Post</button>
		</div>
	</div>
</form>
