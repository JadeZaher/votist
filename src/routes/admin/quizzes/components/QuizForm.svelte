<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { QuizDifficulty } from '@prisma/client';

	const dispatch = createEventDispatcher();

	interface QuizQuestion {
		text: string;
		options: {
			text: string;
			isCorrect: boolean;
			isNoOpinion: boolean;
		}[];
		correctOptionId: string | null;
	}

	let title = '';
	let description = '';
	let difficulty: QuizDifficulty = QuizDifficulty.VOTIST;
	let points = 1;
	let questions: QuizQuestion[] = [
		{
			text: '',
			options: [{ text: '', isCorrect: false, isNoOpinion: false }],
			correctOptionId: null
		}
	];

	async function handleSubmit() {
		const formattedQuestions = questions.map((q) => ({
			text: q.text,
			options: q.options.map((opt) => ({
				text: opt.text,
				isCorrect: opt.isCorrect,
				isNoOpinion: opt.isNoOpinion
			})),
			correctOptionId: q.correctOptionId
		}));

		const response = await fetch('/api/quizzes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title,
				description,
				difficulty,
				points,
				questions: formattedQuestions
			})
		});

		if (response.ok) {
			dispatch('saved');
		} else {
			const error = await response.text();
			console.error('Error creating quiz:', error);
			alert('Failed to create quiz. Please try again.');
			dispatch('error', { message: error });
		}
	}

	function addQuestion() {
		questions = [
			...questions,
			{
				text: '',
				options: [
					{ text: '', isCorrect: false, isNoOpinion: false },
					{ text: 'I have no opinion', isCorrect: false, isNoOpinion: true }
				],
				correctOptionId: null
			}
		];
	}

	function addOption(questionIndex: number, isNoOpinion = false) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: [
							...q.options,
							{
								text: isNoOpinion ? 'I have no opinion' : '',
								isCorrect: false,
								isNoOpinion: isNoOpinion
							}
						]
					}
				: q
		);
	}

	function setCorrectOption(questionIndex: number, optionIndex: number) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						correctOptionId: q.options[optionIndex].text,
						options: q.options.map((opt, j) => ({
							...opt,
							isCorrect: j === optionIndex
						}))
					}
				: q
		);
	}

	function removeQuestion(index: number) {
		if (questions.length <= 1) {
			return;
		}

		if (!confirm('Are you sure you want to remove this question?')) {
			return;
		}

		questions = questions
			.filter((_, i) => i !== index)
			.map((question, newIndex) => ({
				...question,
				sequence: newIndex + 1
			}));
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
	<div class="form-control w-full">
		<label class="label" for="title">
			<span class="label-text">Quiz Title</span>
		</label>
		<input id="title" type="text" class="input input-bordered w-full" bind:value={title} required />
	</div>

	<div class="form-control w-full">
		<label class="label" for="description">
			<span class="label-text">Description</span>
		</label>
		<textarea
			id="description"
			class="textarea textarea-bordered h-24"
			bind:value={description}
			required
		></textarea>
	</div>

	<div class="form-control w-full">
		<label class="label" for="difficulty">
			<span class="label-text">Difficulty Level</span>
		</label>
		<select id="difficulty" class="select select-bordered w-full" bind:value={difficulty}>
			<option value="VOTIST">Votist</option>
			<option value="SCHOLAR">Scholar</option>
			<option value="MENTOR">Mentor</option>
		</select>
	</div>

	<div class="form-control w-full">
		<label class="label" for="points">
			<span class="label-text">Quiz Points</span>
		</label>
		<input
			id="points"
			type="number"
			class="input input-bordered w-full"
			bind:value={points}
			min="1"
			required
		/>
	</div>

	<div class="divider">Questions</div>

	{#each questions as question, questionIndex}
		<div class="card bg-base-200 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-bold">Question {questionIndex + 1}</h3>
				{#if questions.length > 1}
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
					<label class="label" for={'question-text-' + questionIndex}>
						<span class="label-text">Question Text</span>
					</label>
					<input
						id={'question-text-' + questionIndex}
						type="text"
						class="input input-bordered w-full"
						bind:value={question.text}
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for={'options-' + questionIndex}>
						<span class="label-text">Options</span>
					</label>
					{#each question.options.filter((opt) => !opt.isNoOpinion) as option, optionIndex}
						<div class="mt-2 flex items-center gap-2">
							<input
								type="text"
								class="input input-bordered flex-1"
								bind:value={option.text}
								placeholder="Option {optionIndex + 1}"
								required
							/>
							<div class="flex items-center gap-2">
								<input
									type="radio"
									name="correct-{questionIndex}"
									class="radio radio-primary"
									checked={option.isCorrect}
									on:change={() => setCorrectOption(questionIndex, optionIndex)}
								/>
							</div>
						</div>
					{/each}

					<!-- No Opinion Option -->
					<div class="mt-4 flex items-center gap-2">
						<label class="label flex cursor-pointer items-center gap-2">
							<input
								type="checkbox"
								class="checkbox checkbox-primary"
								checked={question.options.some((opt) => opt.isNoOpinion)}
								on:change={(e) => {
									if (e.currentTarget.checked) {
										addOption(questionIndex, true);
									} else {
										questions = questions.map((q, i) =>
											i === questionIndex
												? {
														...q,
														options: q.options.filter((opt) => !opt.isNoOpinion)
													}
												: q
										);
									}
								}}
							/>
							<span class="label-text">Include "No Opinion" option</span>
						</label>
					</div>

					<button
						type="button"
						class="btn btn-ghost btn-sm mt-2"
						on:click={() => addOption(questionIndex)}
					>
						Add Option
					</button>
				</div>
			</div>
		</div>
	{/each}

	<div class="mt-8 flex justify-between gap-4">
		<button type="button" class="btn btn-secondary" on:click={addQuestion}> Add Question </button>
		<button type="submit" class="btn btn-primary"> Create Quiz </button>
	</div>
</form>
