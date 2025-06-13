<script lang="ts">
	import { goto } from '$app/navigation';
	import { QuizDifficulty } from '@prisma/client';
	import type { Quiz, Question, Option } from '$lib/types';

	export let quiz: Quiz;

	let questions = [...quiz.questions];

	function addQuestion() {
		const newQuestion: Question = {
			id: crypto.randomUUID(),
			text: '',
			quizId: quiz.id,
			correctOptionId: undefined,
			options: []
		};
		questions = [...questions, newQuestion];
	}

	function addOption(questionIndex: number) {
		const newOption: Option = {
			id: crypto.randomUUID(),
			text: '',
			isCorrect: false,
			isNoOpinion: false
		};

		questions = questions.map((q, i) =>
			i === questionIndex ? { ...q, options: [...q.options, newOption] } : q
		);
	}

	function handleNoOpinionChange(questionIndex: number, optionIndex: number) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: q.options.map((opt, j) => {
							if (j === optionIndex) {
								// If turning on "no opinion", remove isCorrect
								if (!opt.isNoOpinion) {
									return {
										...opt,
										isNoOpinion: true,
										isCorrect: false
									};
								}
								// If turning off "no opinion", just remove the flag
								return {
									...opt,
									isNoOpinion: false
								};
							}
							return opt;
						})
					}
				: q
		);
	}

	function removeOption(questionIndex: number, optionIndex: number) {
		questions = questions.map((q, i) =>
			i === questionIndex ? { ...q, options: q.options.filter((_, j) => j !== optionIndex) } : q
		);
	}

	function setCorrectOption(questionIndex: number, optionIndex: number) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						correctOptionId: q.options[optionIndex].id,
						options: q.options.map((opt, j) => ({
							...opt,
							isCorrect: j === optionIndex
						}))
					}
				: q
		);
	}

	async function handleSubmit() {
		const response = await fetch(`/api/quizzes/${quiz.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				title: quiz.title,
				description: quiz.description,
				difficulty: quiz.difficulty,
				points: quiz.points,
				questions: questions
			})
		});

		if (response.ok) {
			goto('/admin/quizzes');
		}
	}

	function removeQuestion(questionIndex: number): any {
		if (questions.length <= 1) return; // Prevent removing the last question
		questions = questions.filter((_, i) => i !== questionIndex);
	}
</script>

<div class="p-4">
	<h2 class="mb-4 text-2xl font-bold">Edit Quiz</h2>

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div class="form-control w-full">
			<label class="label" for="title">
				<span class="label-text">Quiz Title</span>
			</label>
			<input
				id="title"
				type="text"
				class="input input-bordered w-full"
				bind:value={quiz.title}
				required
			/>
		</div>

		<div class="form-control w-full">
			<label class="label" for="description">
				<span class="label-text">Description</span>
			</label>
			<textarea
				id="description"
				class="textarea textarea-bordered h-24"
				bind:value={quiz.description}
				required
			></textarea>
		</div>

		<div class="form-control w-full">
			<label class="label" for="difficulty">
				<span class="label-text">Difficulty Level</span>
			</label>
			<select id="difficulty" class="select select-bordered w-full" bind:value={quiz.difficulty}>
				<option value={QuizDifficulty.VOTIST}>Votist</option>
				<option value={QuizDifficulty.SCHOLAR}>Scholar</option>
				<option value={QuizDifficulty.MENTOR}>Mentor</option>
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
				bind:value={quiz.points}
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
						>
							×
						</button>
					{/if}
				</div>

				<div class="space-y-4">
					<div class="form-control">
						<label class="label" for="question-text-{questionIndex}">
							<span class="label-text">Question Text</span>
						</label>
						<input
							type="text"
							class="input input-bordered w-full"
							bind:value={question.text}
							required
						/>
					</div>

					<div class="form-control">
						<label class="label" for="options-{questionIndex}">
							<span class="label-text">Options</span>
						</label>
						<div class="space-y-2">
							{#each question.options as option, optionIndex}
								<div class="flex items-center gap-2">
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
											disabled={option.isNoOpinion}
											on:change={() => setCorrectOption(questionIndex, optionIndex)}
										/>
										<label class="label cursor-pointer">
											<input
												type="checkbox"
												class="checkbox checkbox-sm"
												bind:checked={option.isNoOpinion}
												on:change={() => handleNoOpinionChange(questionIndex, optionIndex)}
											/>
											<span class="label-text ml-2">No opinion</span>
										</label>
									</div>
									{#if question.options.length > 2}
										<button
											type="button"
											class="btn btn-sm btn-ghost btn-circle"
											on:click={() => removeOption(questionIndex, optionIndex)}
										>
											×
										</button>
									{/if}
								</div>
							{/each}
							<button
								type="button"
								class="btn btn-sm btn-ghost"
								on:click={() => addOption(questionIndex)}
							>
								Add Option
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}

		<div class="mt-8 flex justify-between gap-4">
			<button type="button" class="btn btn-secondary" on:click={addQuestion}> Add Question </button>
			<div class="flex gap-2">
				<a href="/admin/quizzes" class="btn">Cancel</a>
				<button type="submit" class="btn btn-primary">Save Changes</button>
			</div>
		</div>
	</form>
</div>
