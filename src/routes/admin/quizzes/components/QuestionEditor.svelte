<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let question: any;
	export let questionIndex: number;
	export let questionsLength: number;
	export let setCorrectOption: (questionIndex: number, optionIndex: number) => void;
	export let removeQuestion: (index: number) => void;
	export let handleNoOpinionChange: (questionIndex: number, checked: boolean) => void;

	export let setQuestionField: (index: number, key: string, value: any) => void;

	const dispatch = createEventDispatcher();
</script>

<div class="card bg-base-200 p-4">
	<div class="mb-4 flex items-center justify-between">
		<h3 class="font-bold">Question {questionIndex + 1}</h3>
		{#if questionsLength > 1}
			<button
				type="button"
				class="btn btn-sm btn-error btn-circle"
				on:click={() => removeQuestion(questionIndex)}
				aria-label="Remove question"
			>
				×
			</button>
		{/if}
	</div>

	<div class="space-y-4">
		<div class="form-control">
			<label class="label" for={'question-title-' + questionIndex}>
				<span class="label-text">Question Text</span>
			</label>
			<input
				id={'question-title-' + questionIndex}
				type="text"
				class="input input-bordered w-full"
				bind:value={question.text}
				required
			/>
		</div>

		<div class="form-control">
			<label class="label" for={'question-image-' + questionIndex}>
				<span class="label-text">Image URL (optional)</span>
			</label>
			<input
				id={'question-image-' + questionIndex}
				type="url"
				class="input input-bordered w-full"
				bind:value={question.imageUrl}
				placeholder="https://example.com/image.jpg"
			/>
			<label class="label" for={'question-image-' + questionIndex}>
				<span class="label-text-alt">Add an image to help illustrate the question</span>
			</label>
		</div>

		<!-- Video URL input -->
		<div class="form-control">
			<label class="label" for={'question-video-' + questionIndex}>
				<span class="label-text">Video URL (YouTube or Vimeo, optional)</span>
			</label>
			<input
				id={'question-video-' + questionIndex}
				type="url"
				class="input input-bordered w-full"
				bind:value={question.videoUrl}
				placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
			/>
			<label class="label" for={'question-video-' + questionIndex}>
				<span class="label-text-alt"
					>Paste a YouTube or Vimeo video link to associate a video with this question</span
				>
			</label>
		</div>

		<div class="form-control w-full">
			<label class="label" for={'question-options-' + questionIndex}>
				<span class="label-text">Options</span>
			</label>
			{#each question.options.slice(0, 4) as option: { text: string; isCorrect: boolean; isNoOpinion: boolean }, optionIndex}
				<div class="mb-2 flex items-center gap-2">
					<input
						type="radio"
						name={'correct-option-' + questionIndex}
						checked={option.isCorrect}
						on:change={() => setCorrectOption(questionIndex, optionIndex)}
						disabled={option.isNoOpinion}
					/>
					<input
						type="text"
						class="input input-bordered w-full"
						bind:value={option.text}
						placeholder={`Option ${optionIndex + 1}`}
						required
					/>
				</div>
			{/each}
			<!-- No Opinion option -->
			<div class="form-control mt-4">
				<label class="label cursor-pointer">
					<input
						type="checkbox"
						class="checkbox"
						checked={question.options.some((opt: { isNoOpinion: boolean }) => opt.isNoOpinion)}
						on:change={(e: Event) =>
							handleNoOpinionChange(questionIndex, (e.target as HTMLInputElement)?.checked)}
					/>
					<span class="label-text ml-2">Add "No Opinion" option</span>
				</label>
			</div>
			{#if !question.options.some((opt: { isCorrect: boolean }) => opt.isCorrect)}
				<div class="text-error mt-2 text-sm">Please select a correct answer</div>
			{/if}
		</div>
	</div>
</div>
