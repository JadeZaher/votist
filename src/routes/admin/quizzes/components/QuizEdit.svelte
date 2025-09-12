<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Quiz } from '$lib/types';
	import QuestionEditor from './QuestionEditor.svelte';

	export let quiz: Quiz;

	let title = quiz?.title ?? '';
	let description = quiz?.description ?? '';
	let passingScore = Number(quiz?.passingScore) || 1;
	let associatedMaterialId = quiz?.associatedMaterialId || '';
	let order = typeof quiz?.order === 'number' ? quiz.order : 0;
	let difficulty = quiz?.difficulty ?? 'VOTIST';
	let questions = Array.isArray(quiz?.questions)
		? quiz.questions.map((q: any) => {
				let opts: any[] = [];
				if (Array.isArray(q.options)) {
					opts = q.options;
				} else if (
					q.options &&
					typeof q.options === 'object' &&
					Object.keys(q.options).length > 0
				) {
					opts = Object.values(q.options);
				}

				opts = opts
					.filter((opt) => typeof opt === 'object' || typeof opt === 'string')
					.map((opt: any) => {
						if (typeof opt === 'string') {
							return {
								text: opt,
								isCorrect: Array.isArray(q.correctAnswer)
									? q.correctAnswer.includes(opt)
									: q.correctAnswer === opt,
								isNoOpinion: opt === 'I have no opinion'
							};
						}
						return {
							text: opt?.text ?? '',
							isCorrect: !!opt?.isCorrect,
							isNoOpinion: !!opt?.isNoOpinion
						};
					});

				return {
					id: q.id,
					text: q.text ?? '',
					type: q.type ?? 'single',
					imageUrl: q.imageUrl || '',
					imageAlt: q.imageAlt || '',
					videoUrl: q.videoUrl || '',
					options: opts
				};
			})
		: [];

	function addQuestion() {
		questions = [
			...questions,
			{
				id: crypto.randomUUID(),
				text: '',
				type: 'single',
				imageUrl: '',
				imageAlt: '',
				videoUrl: '',
				options: Array(4)
					.fill(null)
					.map((): { text: string; isCorrect: boolean; isNoOpinion: boolean } => ({
						text: '',
						isCorrect: false,
						isNoOpinion: false
					}))
			}
		];
	}

	function removeQuestion(index: number) {
		if (questions.length <= 1) {
			showToast('Quiz must have at least one question', 'error');
			return;
		}

		if (!confirm('Are you sure you want to remove this question?')) {
			return;
		}

		questions = questions.filter((_, i) => i !== index);
	}

	function setCorrectOption(questionIndex: number, optionIndex: number) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: q.options.map((opt: any, j: number) => ({
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
							...q.options.filter((opt: any) => !opt.isNoOpinion),
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

	function setQuestionField(index: number, key: string, value: any) {
		questions = questions.map((q, i) => (i === index ? { ...q, [key]: value } : q));
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
		const invalidQuestions = questions.filter(
			(q) =>
				!q.text.trim() ||
				!Array.isArray(q.options) ||
				q.options.length === 0 ||
				!q.options.some((opt) => opt.text.trim()) ||
				!q.options.some((opt) => opt.isCorrect)
		);

		if (invalidQuestions.length > 0) {
			showToast(
				'Each question must have text, at least one option, and a correct answer.',
				'error'
			);
			return;
		}

		if (passingScore < 1 || passingScore > questions.length) {
			showToast('Passing score must be between 1 and the total number of questions', 'error');
			return;
		}

		try {
			const formattedQuestions = questions.map((q) => {
				const correct = q.options.find((opt: any) => opt.isCorrect);
				const result: any = {
					id: q.id,
					text: q.text,
					type: q.type,
					options: q.options,
					correctAnswer: correct || null
				};
				if (q.imageUrl && q.imageUrl.trim() !== '') result.imageUrl = q.imageUrl;
				if (q.imageAlt && q.imageAlt.trim() !== '') result.imageAlt = q.imageAlt;
				if (q.videoUrl && q.videoUrl.trim() !== '') result.videoUrl = q.videoUrl;
				return result;
			});

			const response = await fetch(`/api/quizzes/${quiz.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					description,
					passingScore,
					associatedMaterialId: associatedMaterialId || undefined,
					order,
					questions: formattedQuestions,
					difficulty
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
		<div class="form-control w-full max-w-xs">
			<label class="label" for="order">
				<span class="label-text">Quiz Sequence Order</span>
			</label>
			<div
				id="order"
				class="input input-bordered bg-base-200 w-full cursor-not-allowed select-none"
			>
				{order}
			</div>
			<label class="label" for="order">
				<span class="label-text-alt">Order is managed in the quiz list</span>
			</label>
		</div>
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

		<div class="form-control w-full max-w-xs">
			<label class="label" for="passing-score">
				<span class="label-text">Minimum Correct to Pass</span>
			</label>
			<input
				id="passing-score"
				type="number"
				class="input input-bordered w-full"
				bind:value={passingScore}
				min="1"
				max={questions.length}
				required
			/>
			<label class="label" for="passing-score">
				<span class="label-text-alt"
					>Out of {questions.length} question{questions.length !== 1 ? 's' : ''}</span
				>
			</label>
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="difficulty">
				<span class="label-text">Difficulty</span>
			</label>
			<select
				id="difficulty"
				class="select select-bordered w-full"
				bind:value={difficulty}
				required
			>
				<option value="VOTIST">VOTIST</option>
				<option value="SCHOLAR">SCHOLAR</option>
				<option value="MENTOR">MENTOR</option>
			</select>
		</div>

		<div class="divider">Questions</div>

		{#each questions as question, questionIndex}
			<QuestionEditor
				{question}
				{questionIndex}
				questionsLength={questions.length}
				{setCorrectOption}
				{removeQuestion}
				{handleNoOpinionChange}
				{setQuestionField}
			/>
		{/each}

		<div class="flex justify-center">
			<button type="button" class="btn btn-secondary" on:click={addQuestion}> Add Question </button>
		</div>

		<div class="flex justify-end gap-2">
			<button type="button" class="btn" on:click={handleCancel}>Cancel</button>
			<button type="submit" class="btn btn-primary" on:click={handleSubmit}>Save Changes</button>
		</div>
	</form>
</div>
