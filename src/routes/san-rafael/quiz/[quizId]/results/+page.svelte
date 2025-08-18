<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import QuizSuccessIcon from '$lib/components/icons/QuizSuccessIcon.svelte';
	import DiscussionIcon from '$com/icons/DiscussionIcon.svelte';
	import KnowledgeIcon from '$com/icons/KnowledgeIcon.svelte';
	import CoffeeMugIcon from '$com/icons/CoffeeMugIcon.svelte';

	interface Completion {
		isCompleted: boolean;
		quizScore: number;
		answers: Record<string, string>;
	}

	interface NextQuiz {
		id: string;
		title: string;
		difficulty?: string;
	}

	interface PageData {
		quiz: any;
		completion: Completion;
		nextQuiz?: NextQuiz;
	}

	let { data }: { data: PageData } = $props();

	// Use $derived for pass/fail logic
	const passed = $derived(() => {
		const answers = data.completion?.answers ?? {};
		const questions = data.quiz?.questions ?? [];
		const passingScore = data.quiz?.passingScore ?? 1;
		let correctAnswers = 0;
		for (const question of questions) {
			const userAnswer = answers[question.id];
			if (userAnswer) {
				const selectedOption = question.options.find((option: any) => option.text === userAnswer);
				if (selectedOption && selectedOption.isNoOpinion) {
					continue;
				} else if (selectedOption && selectedOption.isCorrect) {
					correctAnswers++;
				}
			}
		}
		const isCompleted = data.completion?.isCompleted ?? false;
		return isCompleted && correctAnswers >= passingScore;
	});

	async function handleBackToRoadmap() {
		await invalidateAll();
		goto('/san-rafael/quizzes'); // Go to quiz roadmap page
	}

	async function handleRetakeQuiz() {
		let quizId = data?.quiz?.id;
		const pageParams = (globalThis as any).$page?.params;
		if (!quizId && pageParams?.quizId) {
			quizId = pageParams.quizId;
		}
		if (quizId) {
			goto(`/san-rafael/quiz/${quizId}?retake=${Date.now()}`);
		}
	}

	function handleNextQuiz() {
		if (data.nextQuiz) {
			goto(`/san-rafael/quiz/${data.nextQuiz.id}`); // Go to next quiz
		}
	}

	function handleVoteNow() {
		goto('/san-rafael/proposals'); // Go to proposals for voting
	}

	function handleLearnMore() {
		goto('/san-rafael/learn-more'); // Go to learn more page
	}
</script>

{#if passed()}
	<div class="min-h-screen bg-white py-16">
		<div class="container mx-auto flex max-w-5xl flex-col items-center px-4">
			<!-- Main Title -->
			<h1 class="mb-8 text-center text-5xl font-bold text-cyan-600">
				Completed! {data.quiz.title}
			</h1>

			<!-- You Gain Section -->
			<div class="mb-8 w-full max-w-3xl">
				<h2 class="mb-6 text-3xl font-bold text-amber-400">You gain:</h2>
				<div class="flex flex-col gap-6 md:flex-row md:items-center md:gap-12">
					<!-- Left: Voting Power & Knowledge -->
					<div class="flex flex-1 flex-col gap-6">
						<div class="flex items-center gap-4">
							<QuizSuccessIcon size="w-6 h-6" />
							<span class="text-xl font-medium text-amber-400">+1</span>
							<span class="text-xl font-medium text-cyan-800">
								Vote {data.quiz.title.includes(':') ? data.quiz.title.split(':')[0] : 'San Rafael'} Housing
							</span>
						</div>
						<div class="flex items-center gap-4">
							<KnowledgeIcon size="w-8 h-8" />
							<span class="text-xl font-medium text-amber-400">+1</span>
							<span class="text-xl font-medium text-cyan-800">Knowledge</span>
						</div>
					</div>
					<!-- Right: Discussion & Status -->
					<div class="flex flex-1 flex-col gap-6">
						<div class="flex items-center gap-4">
							<DiscussionIcon size="w-6 h-6" />
							<span class="text-xl font-medium text-cyan-800">Join the discussions</span>
						</div>
						<div class="flex items-center gap-4">
							<span
								class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-400"
							>
								<span class="text-xs font-semibold text-white">V</span>
							</span>
							<span class="text-xl font-medium text-cyan-800">Votist status</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons + Description Row -->
			<div class="mb-8 flex w-full max-w-3xl flex-col items-start gap-8 md:flex-row">
				<!-- Left: Buttons -->
				<div class="flex flex-col gap-4">
					<button
						onclick={handleVoteNow}
						class="btn btn-primary btn-lg flex items-center gap-4 px-10 text-4xl font-medium shadow"
					>
						<QuizSuccessIcon size="w-8 h-8" />
						Vote
					</button>
					{#if data.nextQuiz}
						<button
							onclick={handleNextQuiz}
							class="btn btn-primary btn-lg px-10 text-4xl font-medium shadow"
						>
							Next Quiz
						</button>
					{/if}
				</div>
				<!-- Right: Descriptive Text -->
				<div class="flex flex-1 flex-col justify-center gap-4">
					<div class="text-4xl font-medium text-yellow-500">Vote Now</div>
					<div class="text-4xl font-medium text-cyan-800">
						Or, keep going to get more voting power.
					</div>
				</div>
			</div>

			<!-- Back to Roadmap Button -->
			<div class="mt-16 text-center">
				<button
					class="btn btn-outline border-cyan-600 px-8 text-lg text-cyan-600 hover:bg-cyan-600 hover:text-white"
					onclick={handleBackToRoadmap}
				>
					Back to Quiz Roadmap
				</button>
			</div>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-white py-16">
		<div class="container mx-auto flex max-w-7xl flex-col items-start px-4">
			<div class="flex w-full flex-col items-start justify-start gap-12 lg:flex-row">
				<!-- Left: Coffee Mug Icon -->
				<div class="flex flex-shrink-0 flex-col items-start justify-start">
					<CoffeeMugIcon size="w-28 h-32" />
				</div>
				<!-- Right: Main Content -->
				<div class="flex flex-1 flex-col gap-8 lg:ml-12">
					<!-- Good effort & Learn more -->
					<div class="mb-4 flex flex-col gap-2 text-left">
						<div class="text-5xl leading-tight font-medium text-black">Good effort</div>
						<div class="text-4xl font-medium text-cyan-600">
							Learn more about this topic in the Research Tab
						</div>
					</div>
					<!-- Try again -->
					<div class="relative mb-12 h-40 w-full max-w-2xl rounded-lg text-left">
						<!-- Start Button -->
						<button
								onclick={handleRetakeQuiz}
								class="btn btn-primary btn-lg absolute top-[99px] left-2 flex h-14 w-40 items-center justify-center rounded-lg px-0 text-[2.5rem] font-bold shadow"
						>
								Start
						</button>
						<!-- Quiz Title -->
						<div
							class="absolute top-[91px] left-[201px] flex h-16 w-[668px] items-center text-left text-6xl font-medium text-cyan-800"
						>
							{data.quiz.title}
						</div>
						<!-- Try again! -->
						<div
							class="absolute top-0 left-0 flex h-11 w-[577px] items-center text-left text-6xl font-medium italic text-cyan-600"
						>
							Try again!
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
