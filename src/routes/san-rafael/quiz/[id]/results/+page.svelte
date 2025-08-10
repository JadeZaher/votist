<script lang="ts">
	import { goto } from '$app/navigation';
	import { invalidateAll } from '$app/navigation';
	import type { QuizDifficulty, Quiz } from '$lib/types';

	interface Completion {
		score: number;
		completed: boolean;
		completedAt: Date | null;
		answers: Record<string, string>;
	}

	interface NextQuiz {
		id: string;
		title: string;
		difficulty: QuizDifficulty;
	}

	interface UserStats {
		totalPoints: number;
		votingPower: number;
		knowledgePoints: number;
	}

	interface PageData {
		quiz: Quiz & { sequence: number };
		completion: Completion;
		nextQuiz?: NextQuiz;
		userStats: UserStats;
	}

	let { data }: { data: PageData } = $props();

	const passed = $derived(data.completion.score >= data.quiz.passingScore);

	async function handleBackToRoadmap() {
		await invalidateAll();
		goto('/quiz');
	}

	function handleRetakeQuiz() {
		goto(`/quiz/${data.quiz.id}`);
	}

	function handleNextQuiz() {
		if (data.nextQuiz) {
			goto(`/quiz/${data.nextQuiz.id}`);
		}
	}

	function handleVoteNow() {
		goto('/proposals');
	}

	function handleLearnMore() {
		goto('/learn-more');
	}
</script>

{#if passed}
	<!-- Success Page Design Based on Figma -->
	<div class="min-h-screen bg-white py-16">
		<div class="container mx-auto max-w-6xl px-4">
			<!-- Main Title -->
			<div class="mb-16 text-center">
				<h1 class="mb-4 text-5xl font-bold text-cyan-600">
					Completed! {data.quiz.title}
				</h1>
			</div>

			<!-- You Gain Section -->
			<div class="mb-16">
				<h2 class="mb-8 text-3xl font-bold text-amber-400">You gain:</h2>

				<div class="flex flex-col gap-6">
					<!-- Voting Power -->
					<div class="flex items-center gap-4">
						<!-- Trophy Icon (simplified version of Figma design) -->
						<div class="relative h-12 w-12">
							<div class="h-12 w-12 rounded bg-amber-400"></div>
							<div class="absolute top-0.5 left-1 h-9 w-8 bg-amber-200"></div>
							<div class="absolute top-2 left-1.5 h-11 w-9 bg-amber-200"></div>
							<div class="absolute top-1 left-0.5 h-10 w-10 bg-amber-400"></div>
							<div class="absolute bottom-1 left-2 h-3.5 w-6 bg-yellow-100"></div>
						</div>
						<div class="text-xl">
							<span class="font-medium text-amber-400">+1</span>
							<span class="font-medium text-cyan-800">
								Vote {data.quiz.title.includes(':') ? data.quiz.title.split(':')[0] : 'San Rafael'} Housing</span
							>
						</div>
					</div>

					<!-- Knowledge Point -->
					<div class="flex items-center gap-4">
						<div
							class="flex h-6 w-6 items-center justify-center rounded-full border border-amber-200 bg-amber-400"
						>
							<span class="text-xl font-medium text-white">K</span>
						</div>
						<div class="text-xl">
							<span class="font-medium text-amber-400">+1</span>
							<span class="font-medium text-cyan-800"> Knowledge</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons and Right Side Info -->
			<div class="grid items-start gap-12 lg:grid-cols-2">
				<!-- Left Side - Action Buttons -->
				<div class="flex flex-col gap-6">
					<!-- Vote Button -->
					<div class="flex items-center gap-6">
						<button
							onclick={handleVoteNow}
							class="flex h-16 items-center gap-4 rounded-[10px] bg-cyan-700 px-8 text-4xl font-medium text-white shadow-lg transition-colors hover:bg-cyan-800"
						>
							<!-- Trophy Icon (smaller version) -->
							<div class="relative h-8 w-8">
								<div class="h-8 w-8 rounded bg-amber-400"></div>
								<div class="absolute top-0.5 left-0.5 h-6 w-6 bg-amber-200"></div>
								<div class="absolute top-1 left-1 h-7 w-6 bg-amber-200"></div>
								<div class="absolute top-0.5 left-0.5 h-7 w-7 bg-amber-400"></div>
								<div class="absolute bottom-0.5 left-1.5 h-2 w-4 bg-yellow-100"></div>
							</div>
							Vote
						</button>
						<div class="text-4xl font-medium text-yellow-500">Vote Now</div>
					</div>

					<!-- Next Quiz Button -->
					{#if data.nextQuiz}
						<div class="flex items-center gap-6">
							<button
								onclick={handleNextQuiz}
								class="h-16 rounded-[10px] bg-cyan-700 px-8 text-4xl font-medium text-white shadow-lg transition-colors hover:bg-cyan-800"
							>
								Next Quiz
							</button>
							<div class="text-4xl font-medium text-cyan-800">
								Or, keep going to get more voting power.
							</div>
						</div>
					{/if}
				</div>

				<!-- Right Side - Additional Info -->
				<div class="flex flex-col gap-8">
					<!-- Join Discussions -->
					<div class="flex items-center gap-4">
						<div class="flex items-center">
							<div class="h-3 w-3 rounded bg-amber-400"></div>
							<div class="-ml-1 h-5 w-5 rounded bg-amber-400"></div>
						</div>
						<span class="text-xl font-medium text-cyan-800">Join the discussions</span>
					</div>

					<!-- Current Status -->
					<div class="flex items-center gap-4">
						<div class="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400">
							<span class="text-xs font-semibold text-white">V</span>
						</div>
						<span class="text-xl font-medium text-cyan-800">Votist status</span>
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
	<!-- Failed Quiz Design Based on Figma -->
	<div class="min-h-screen bg-white py-16">
		<div class="container mx-auto max-w-7xl px-4">
			<!-- Main Layout -->
			<div class="flex flex-col items-start gap-8 lg:flex-row">
				<!-- Left Side - Dark Rectangle (represents the graphical element from Figma) -->
				<div class="flex-shrink-0">
					<div class="h-32 w-28 rounded bg-gray-800"></div>
				</div>

				<!-- Right Side - Main Content -->
				<div class="flex-1 lg:ml-8">
					<!-- Main Message -->
					<div class="mb-16">
						<div class="mb-6 text-5xl font-medium">
							<span class="text-black">Good effort</span>
						</div>
						<div class="text-4xl leading-relaxed font-medium text-cyan-600">
							Learn more about this topic in the Research Tab
						</div>
					</div>

					<!-- Try Again Section -->
					<div class="mb-16">
						<h2 class="mb-12 text-6xl font-medium text-cyan-600">Try again!</h2>

						<!-- Action Buttons Row -->
						<div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
							<!-- Start Button -->
							<button
								onclick={handleRetakeQuiz}
								class="flex-shrink-0 rounded-lg bg-cyan-700 px-12 py-4 text-3xl font-medium text-white shadow-lg transition-colors hover:bg-cyan-800"
							>
								Start
							</button>

							<!-- Quiz Title -->
							<div class="text-4xl leading-tight font-medium text-cyan-800 lg:text-6xl">
								{data.quiz.title.includes(':') ? data.quiz.title.split(':')[0] : data.quiz.title}, {data.quiz.title.includes(
									':'
								)
									? data.quiz.title.split(':')[1]?.trim()
									: 'Location'}
							</div>
						</div>
					</div>

					<!-- Learn More Button -->
					<div class="mb-12">
						<button
							onclick={handleLearnMore}
							class="rounded-lg bg-cyan-600 px-8 py-3 text-xl font-medium text-white shadow-lg transition-colors hover:bg-cyan-700"
						>
							Learn More in Research Tab
						</button>
					</div>

					<!-- Back to Roadmap Button -->
					<div class="text-center lg:text-left">
						<button
							class="btn btn-outline border-cyan-600 px-8 text-lg text-cyan-600 hover:bg-cyan-600 hover:text-white"
							onclick={handleBackToRoadmap}
						>
							Back to Quiz Roadmap
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
