<script lang="ts">
	import { resetQuiz, goToPage } from '../../../stores/quizStore';
	import coffeeSVG from '$lib/assets/Coffee.svg';

	function handleTryAgain() {
		resetQuiz();
		goToPage('start');
	}
</script>

<div class="bg-base-100 min-h-screen w-full">
	<div class="container mx-auto px-4">
		<div class="pt-8 md:pt-[171px]">
			<div class="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
				<img src={coffeeSVG} alt="coffee" class="h-24 w-20 md:h-32 md:w-28" />
				<div class="w-full text-center md:w-[890px] md:text-left">
					<h3 class="text-base-content mb-2 text-3xl font-medium md:text-5xl">Good effort</h3>
					<p class="text-primary text-2xl font-medium md:text-4xl">
						Learn more about this topic in the Research Tab
					</p>
				</div>
			</div>

			<div class="mt-12 text-center md:mt-20 md:text-left">
				<h2 class="text-primary mb-6 text-4xl font-medium italic md:mb-8 md:text-6xl">
					Try again!
				</h2>

				<div class="flex flex-col items-center gap-4 md:flex-row md:gap-8">
					<button
						class="btn btn-primary h-14 min-w-[160px] text-xl font-medium shadow-[5px_2.5px_7.5px_0px_rgba(0,0,0,0.25)] md:text-3xl"
						on:click={handleTryAgain}
					>
						Start
					</button>
					<span class="text-primary text-3xl font-medium md:text-6xl"> San Rafael, Location </span>
				</div>
			</div>
		</div>
	</div>
</div>
