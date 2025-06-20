<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { QuizDifficulty } from '$lib/types';

	const dispatch = createEventDispatcher();

	interface QuizQuestion {
		title: string;
		description?: string;
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
			title: '',
			description: '',
			options: Array(4)
				.fill(null)
				.map(() => ({
					text: '',
					isCorrect: false,
					isNoOpinion: false
				})),
			correctOptionId: null
		}
	];

	async function handleSubmit() {
		const invalidQuestions = questions.filter((q) => !q.options.some((opt) => opt.isCorrect));

		if (invalidQuestions.length > 0) {
			showToast('Each question must have one correct answer selected', 'error');
			return;
		}

		try {
			const formattedQuestions = questions.map((q) => ({
				title: q.title,
				description: q.description || '',
				options: q.options.map((opt) => ({
					text: opt.text,
					isCorrect: opt.isCorrect,
					isNoOpinion: opt.isNoOpinion
				}))
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
		} catch (error) {
			showToast('Error saving quiz', 'error');
			console.error('Error:', error);
		}
	}

	function addQuestion() {
		questions = [
			...questions,
			{
				title: '',
				description: '',
				options: Array(4)
					.fill(null)
					.map(() => ({
						text: '',
						isCorrect: false,
						isNoOpinion: false
					})),
				correctOptionId: null
			}
		];
	}

	function addOption(questionIndex: number, isNoOpinion = false) {
		const currentQuestion = questions[questionIndex];
		const regularOptions = currentQuestion.options.filter((opt) => !opt.isNoOpinion);

		// Only add if we have less than 4 regular options
		if (!isNoOpinion && regularOptions.length >= 4) return;

		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: [
							...q.options.filter((opt) => !opt.isNoOpinion),
							{
								text: isNoOpinion ? 'I have no opinion' : '',
								isCorrect: false,
								isNoOpinion: isNoOpinion
							},
							...(isNoOpinion ? [] : q.options.filter((opt) => opt.isNoOpinion))
						]
					}
				: q
		);
	}

	function handleNoOpinionChange(questionIndex: number, checked: boolean) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: [
							...q.options.slice(0, 4), // Keep first 4 options unchanged
							...(checked
								? [
										{
											text: 'I have no opinion',
											isCorrect: false,
											isNoOpinion: true
										}
									]
								: [])
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
							isCorrect: j === optionIndex && !opt.isNoOpinion
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

	function showToast(arg0: string, arg1: string) {
		throw new Error('Function not implemented.');
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
			{#each Object.values(QuizDifficulty) as level}
				<option value={level}>{level}</option>
			{/each}
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
					<label class="label" for={'question-title-' + questionIndex}>
						<span class="label-text">Question Title</span>
					</label>
					<input
						id={'question-title-' + questionIndex}
						type="text"
						class="input input-bordered w-full"
						bind:value={question.title}
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for={'question-description-' + questionIndex}>
						<span class="label-text">Description (Optional)</span>
					</label>
					<textarea
						id={'question-description-' + questionIndex}
						class="textarea textarea-bordered h-24"
						bind:value={question.description}
						placeholder="Add additional context..."
					></textarea>
				</div>

				<div class="form-control w-full">
					<label class="label" for={'question-options-' + questionIndex}>
						<span class="label-text">Options (4 required)</span>
					</label>

					{#each question.options.slice(0, 4) as option, optionIndex}
						<div class="join mt-2 w-full">
							<input
								type="text"
								class="input input-bordered join-item w-full"
								bind:value={option.text}
								placeholder="Option {optionIndex + 1}"
								required
							/>
							<input
								type="radio"
								name="correct-{questionIndex}"
								class="radio radio-primary join-item"
								class:radio-error={!question.options.some((opt) => opt.isCorrect)}
								checked={option.isCorrect}
								on:change={() => setCorrectOption(questionIndex, optionIndex)}
								required
							/>
						</div>
					{/each}

					<!-- No Opinion option -->
					<div class="form-control mt-4">
						<label class="label cursor-pointer">
							<span class="label-text">Include "No Opinion" option</span>
							<input
								type="checkbox"
								class="checkbox checkbox-primary"
								checked={question.options.some((opt) => opt.isNoOpinion)}
								on:change={(e) => handleNoOpinionChange(questionIndex, e.currentTarget.checked)}
							/>
						</label>
					</div>

					{#if !question.options.some((opt) => opt.isCorrect)}
						<div class="text-error mt-2 text-sm">Please select a correct answer</div>
					{/if}
				</div>
			</div>
		</div>
	{/each}

	<div class="flex justify-between">
		<button type="button" class="btn" on:click={addQuestion}> Add Question </button>
		<div class="join">
			<button type="button" class="btn join-item" on:click={() => dispatch('cancel')}>
				Cancel
			</button>
			<button type="submit" class="btn btn-primary join-item">Save Quiz</button>
		</div>
	</div>
</form>
