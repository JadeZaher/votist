<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import QuestionEditor from './QuestionEditor.svelte';

	const dispatch = createEventDispatcher<{
		saved: void;
		cancel: void;
		error: { message: string };
	}>();

	interface LocalOption {
		text: string;
		isCorrect: boolean;
		isNoOpinion: boolean;
	}

	interface LocalQuestion {
		id: string;
		text: string;
		type: string;
		imageUrl?: string;
		imageAlt?: string;
		videoUrl?: string;
		options: LocalOption[];
	}

	let title = '';
	let description = '';
	let difficulty = 'VOTIST'; // Updated to match QuizEdit
	let passingScore = 1;
	let associatedMaterialId: string = '';
	let questions: LocalQuestion[] = [
		{
			id: crypto.randomUUID(),
			text: '',
			type: 'single-choice',
		imageUrl: '',
		imageAlt: '',
		videoUrl: '',
			options: Array(4)
				.fill(null)
				.map(() => ({
					text: '',
					isCorrect: false,
					isNoOpinion: false
				}))
		}
	];

	$: if (passingScore > questions.length) {
		passingScore = questions.length;
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
				const correct = q.options.find((opt) => opt.isCorrect);
				return {
					id: q.id,
					text: q.text,
					type: q.type,
					imageUrl: q.imageUrl,
					imageAlt: q.imageAlt,
					options: q.options,
					correctAnswer: correct ? { ...correct } : null
				};
			});

			const response = await fetch('/api/quizzes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					title,
					description,
					difficulty, // Include difficulty in the request
					passingScore,
					associatedMaterialId: associatedMaterialId || undefined,
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
				id: crypto.randomUUID(),
				text: '',
				type: 'single-choice',
				imageUrl: '',
				imageAlt: '',
				options: Array(4)
					.fill(null)
					.map(() => ({
						text: '',
						isCorrect: false,
						isNoOpinion: false
					}))
			}
		];
	}

	function handleNoOpinionChange(questionIndex: number, checked: boolean) {
		questions = questions.map((q, i) =>
			i === questionIndex
				? {
						...q,
						options: [
							...q.options.filter((opt) => !opt.isNoOpinion),
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
			showToast('Quiz must have at least one question', 'error');
			return;
		}

		if (!confirm('Are you sure you want to remove this question?')) {
			return;
		}

		questions = questions.filter((_, i) => i !== index);
	}

	function showToast(message: string, type: 'success' | 'error' = 'success') {
		const toast = document.createElement('div');
		toast.className = `toast toast-end`;
		toast.innerHTML = `
			<div class="alert ${type === 'success' ? 'alert-success' : 'alert-error'}">
				<span>${message}</span>
			<!-- removed stray closing div after refactor -->
		`;
		document.body.appendChild(toast);
		setTimeout(() => toast.remove(), 3000);
	}

	function setQuestionField(index: number, key: string, value: any) {
		questions = questions.map((q, i) =>
			i === index
				? {
						...q,
						[key]: value
					}
				: q
		);
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<!-- Removed leftover open div from previous question form markup -->
		<label class="label" for="title">
			<span class="label-text">Quiz Title</span>
		</label>
		<input id="title" type="text" class="input input-bordered w-full" bind:value={title} required />

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

	<!-- Add difficulty selector -->
	<div class="form-control w-full max-w-xs">
		<label class="label" for="difficulty">
			<span class="label-text">Difficulty</span>
		</label>
		<select id="difficulty" class="select select-bordered w-full" bind:value={difficulty} required>
			<option value="VOTIST">VOTIST</option>
			<option value="SCHOLAR">SCHOLAR</option>
			<option value="MENTOR">MENTOR</option>
		</select>
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

	<div class="divider">Questions</div>

		{#each questions as question, questionIndex}
			<QuestionEditor
				question={question}
				{questionIndex}
				questionsLength={questions.length}
				{setCorrectOption}
				{removeQuestion}
				{handleNoOpinionChange}
				{setQuestionField}
			/>
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