<script lang="ts">
	import { goto } from '$app/navigation';
	import { QuizDifficulty, type Quiz } from '$lib/types';

	export let quiz: Quiz;

	let title = quiz.title;
	let description = quiz.description;
	let difficulty = quiz.difficulty;
	let points = quiz.points;
	let questions = quiz.questions.map((q) => ({
		title: q.title,
		description: q.description,
		options: [
			// First map existing regular options (non "No Opinion")
			...q.options
				.filter((opt) => opt.text !== 'I have no opinion')
				.map((opt) => ({
					id: opt.id,
					text: opt.text,
					isCorrect: opt.id === q.correctOptionId,
					isNoOpinion: false
				})),
			// Add "No Opinion" option if it exists
			...(q.options.some((opt) => opt.text === 'I have no opinion')
				? [
						{
							id: q.options.find((opt) => opt.text === 'I have no opinion')?.id,
							text: 'I have no opinion',
							isCorrect: false,
							isNoOpinion: true
						}
					]
				: [])
		],
		correctOptionId: q.correctOptionId
	}));

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

	function handleNoOpinionChange(questionIndex: number, checked: boolean) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: [
							...q.options.filter((opt) => !opt.isNoOpinion), // Keep regular options
							...(checked
								? [
										{
											id: q.options.find((opt) => opt.isNoOpinion)?.id, // Preserve ID if it exists
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

	async function handleSubmit() {
		try {
			const formattedQuestions = questions.map((q) => ({
				title: q.title,
				description: q.description,
				correctOptionId: q.correctOptionId,
				options: q.options.filter(
					(opt) => !opt.isNoOpinion || (opt.isNoOpinion && q.options.some((o) => o.isNoOpinion))
				)
			}));

			const response = await fetch(`/api/quizzes/${quiz.id}`, {
				method: 'PUT',
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
				showToast('Quiz saved successfully!');
				goto('/admin/quizzes');
			} else {
				const error = await response.text();
				showToast('Failed to save quiz', 'error');
				console.error('Error updating quiz:', error);
			}
		} catch (error) {
			showToast('An error occurred', 'error');
			console.error('Error:', error);
		}
	}

	function handleCancel() {
		goto('/admin/quizzes');
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
				bind:value={title}
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

					<div class="form-control">
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
									checked={option.isCorrect}
									on:change={() => setCorrectOption(questionIndex, optionIndex)}
								/>
							</div>
						{/each}

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
					</div>
				</div>
			</div>
		{/each}

		<div class="flex justify-end gap-2">
			<button type="button" class="btn" on:click={handleCancel}> Cancel </button>
			<button type="submit" class="btn btn-primary"> Save Changes </button>
		</div>
	</form>
</div>
