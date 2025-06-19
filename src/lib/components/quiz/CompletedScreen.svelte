<script lang="ts">
	import { resetQuiz, goToPage } from '../../../stores/quizStore';

	function handleVoteClick() {
		goToPage('tryAgain');
	}

	function handleNextQuizClick() {
		goToPage('tryAgain');
	}
</script>

<div
	class="mx-auto w-2/3 justify-center rounded-lg bg-white p-12 text-center align-middle shadow-md"
>
	<div class="py-8 text-center">
		<h2 class="mb-14 text-5xl font-bold text-teal-700">Completed! San Rafael, CA: Location</h2>

		<div class="mb-20 flex justify-center space-x-8 text-3xl font-bold text-teal-700">
			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				<span class="ml-2 text-lg">+1</span>
				<span class="ml-2 text-lg">Vote</span>
			</div>

			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
					<span class="font-bold">K</span>
				</div>
				<span class="ml-2 text-lg">+1</span>
				<span class="ml-2 text-lg">Knowledge</span>
			</div>

			<div class="flex items-center">
				<div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-white">
					<span class="font-bold">S</span>
				</div>
				<span class="ml-2 text-lg text-gray-400"
					>Status = <span class="text-teal-700">Votist</span></span
				>
			</div>
		</div>

		<div class="justify-left mb-8 flex space-x-4 px-40 font-bold">
			<button
				class="flex items-center rounded-md bg-teal-600 px-6 py-2 text-white shadow-sm transition duration-150 hover:bg-teal-700"
				on:click={handleVoteClick}
			>
				<div
					class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
							clip-rule="evenodd"
						/>
					</svg>
				</div>
				Vote
			</button>
			<div class="text-2xl font-bold text-yellow-500">Vote Now</div>
		</div>

		<div class="justify-left flex space-x-4 px-40 font-bold">
			<button
				class="rounded-md bg-teal-600 px-6 py-2 text-white shadow-sm transition duration-150 hover:bg-teal-700"
				on:click={handleNextQuizClick}
			>
				Next Quiz
			</button>
			<div class="text-2xl text-teal-700">Or, keep going to get more voting power.</div>
		</div>
	</div>
</div>
