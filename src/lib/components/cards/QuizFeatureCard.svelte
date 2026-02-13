<script lang="ts">
	export let backgroundImage: string;
	export let title: string;
	export let level: string;
	export let location: string;
	export let buttonText: string;
	export let buttonHref: string;
</script>

<div class="relative mx-auto my-8 max-w-6xl overflow-hidden rounded-lg shadow-lg md:my-16">
	<div class="relative h-64 md:h-96">
		<img src={backgroundImage} alt="Quiz background" class="h-full w-full object-cover" />
		<div class="bg-votist-blue/15 absolute inset-0"></div>
		<div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
			<h2 class="mb-2 text-lg font-light tracking-wide md:text-2xl">
				{title}
			</h2>
			<p class="mb-4 text-base font-medium md:mb-6 md:text-lg">
				{level}
			</p>
			<h1 class="mb-6 text-2xl font-bold md:mb-8 md:text-4xl">
				{location}
			</h1>
			<a href={buttonHref}>
				<button
					class="rounded-lg bg-yellow-400 px-8 py-3 text-base font-semibold text-black transition-colors hover:bg-yellow-300 md:px-12 md:py-4 md:text-xl"
				>
					{buttonText}
				</button>
			</a>
		</div>
	</div>
</div>
