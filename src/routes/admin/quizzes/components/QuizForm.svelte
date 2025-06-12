<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { QuizDifficulty } from '$lib/types';

	const dispatch = createEventDispatcher();

	let title = '';
	let description = '';
	let difficulty: QuizDifficulty = QuizDifficulty.VOTIST;
	let questions = [
		{
			text: '',
			options: ['', '', '', ''],
			correctAnswer: '',
			points: 1
		}
	];

	async function handleSubmit() {
		const formattedQuestions = questions.map((q) => ({
			text: q.text,
			points: q.points,
			options: q.options
				.filter((opt) => opt.trim() !== '')
				.map((optionText) => ({
					text: optionText
				})),
			correctOptionId: null // This will be set after creation
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
				options: ['', '', '', ''],
				correctAnswer: '',
				points: 1
			}
		];
	}

	function removeQuestion(index: number) {
		questions = questions.filter((_, i) => i !== index);
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

	<div class="divider">Questions</div>

	{#each questions as question, i}
		<div class="card bg-base-200 p-4">
			<div class="mb-4 flex items-center justify-between">
				<h3 class="font-bold">Question {i + 1}</h3>
				{#if questions.length > 1}
					<button
						type="button"
						class="btn btn-sm btn-ghost btn-circle"
						on:click={() => removeQuestion(i)}
					>
						×
					</button>
				{/if}
			</div>

			<div class="space-y-4">
				<div class="form-control">
					<label class="label" for={'question-text-' + i}>Question Text</label>
					<input
						id={'question-text-' + i}
						type="text"
						class="input input-bordered w-full"
						bind:value={question.text}
						required
					/>
				</div>

				<div class="form-control">
					<label class="label" for={'question-options-' + i}>Options</label>
					{#each question.options as _, j}
						<div class="mt-2 flex gap-2">
							<input
								type="text"
								class="input input-bordered w-full"
								bind:value={question.options[j]}
								placeholder="Option {j + 1}"
								required
							/>
						</div>
					{/each}
				</div>

				<div class="form-control">
					<label class="label" for={'correct-answer-' + i}>
						<span class="label-text">Correct Answer</span>
					</label>
					<select
						class="select select-bordered w-full"
						bind:value={question.correctAnswer}
						required
					>
						<option value="">Select correct answer</option>
						{#each question.options as option}
							{#if option}
								<option value={option}>{option}</option>
							{/if}
						{/each}
					</select>
				</div>

				<div class="form-control">
					<label class="label" for={'points-' + i}>
						<span class="label-text">Points</span>
					</label>
					<input
						type="number"
						class="input input-bordered w-full"
						bind:value={question.points}
						min="1"
						required
					/>
				</div>
			</div>
		</div>
	{/each}

	<div class="mt-8 flex justify-between gap-4">
		<button type="button" class="btn btn-secondary" on:click={addQuestion}> Add Question </button>
		<button type="submit" class="btn btn-primary"> Create Quiz </button>
	</div>
</form>
