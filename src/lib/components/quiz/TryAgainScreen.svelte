<script lang="ts">
	import { resetQuiz, goToPage } from '../../../stores/quizStore';
	import coffeSVG from '$lib/assets/Coffee.svg';

	function handleTryAgain() {
		resetQuiz();
		goToPage('start');
	}
</script>

<div
	class="mx-auto w-2/3 justify-center rounded-lg bg-white p-12 text-center align-middle shadow-md"
>
	<div class="py-8 text-center">
		<div class="mb-4 flex items-center justify-center">
			<img src={coffeSVG} alt="coffee" />
			<div class=" ml-8 text-left">
				<h3 class="text-4xl font-medium text-gray-600">Good effort</h3>
				<p class="text-3xl font-bold text-teal-600">
					Learn more about this topic in the Research Tab
				</p>
			</div>
		</div>

		<div class="mx-48 text-left">
			<h2 class="my-8 text-5xl font-bold text-teal-700">Try again!</h2>

			<button
				class="rounded-md bg-teal-600 px-6 py-2 text-2xl font-bold text-white shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)] transition duration-150 hover:bg-teal-900"
				on:click={handleTryAgain}
			>
				Start
			</button>
			<span class="ml-4 text-2xl text-teal-700">San Rafael, Location</span>
		</div>
	</div>
</div>
