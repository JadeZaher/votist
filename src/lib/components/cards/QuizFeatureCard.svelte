<script lang="ts">
	export let backgroundImage: string;
	export let title: string;
	export let level: string;
	export let location: string;
	export let buttonText: string;
	export let buttonHref: string;
</script>

<div class="relative mx-auto my-16 max-w-[90vw] overflow-hidden rounded-lg shadow-lg">
	<!-- Background Image with Overlay -->
	<div class="relative h-96">
		<img src={backgroundImage} alt="Quiz background" class="h-full w-full object-cover" />
		<!-- Dark overlay for better text readability -->
		<div class="bg-votist-blue/15 absolute inset-0"></div>

		<!-- Content -->
		<div class="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
			<h2 class="mb-2 text-2xl font-light tracking-wide">
				{title}
			</h2>
			<p class="mb-6 text-lg font-medium">
				{level}
			</p>
			<h1 class="mb-8 text-4xl font-bold">
				{location}
			</h1>
			<a href={buttonHref}>
				<button
					class="rounded-lg bg-yellow-400 px-12 py-4 text-xl font-semibold text-black transition-colors hover:bg-yellow-300"
				>
					{buttonText}
				</button>
			</a>
		</div>
	</div>
</div>
