<script lang="ts">
	import { toImageUrl } from '../../util/image';
	import san_rafael from '$lib/proposals/san-rafael.png';

	export let title: string = 'San Rafael California';
	export let subtitle: string = 'Growth, Housing, and the Future We Decide';
	export let description: string =
		'San Rafael is growing, but housing isn’t keeping up. With the world’s population expected to surpass 9 billion by 2040 and 11 billion by 2100, urban centers everywhere are struggling to expand while preserving their identity, resources, and livability. How should San Rafael grow to meet the future?';
	export let image: string = san_rafael;
</script>

<div class="container mx-auto px-4 py-12">
	<h1 class="text-primary z-10 -translate-x-[.2rem] translate-y-2 text-left text-6xl font-bold">
		{title}
	</h1>
	<div
		class="gradient-bg relative h-[400px] overflow-clip bg-[#2B7B9B] text-white"
		style="--bg: {toImageUrl(image)}"
	>
		<div class="p-4">
			<h2 class="mb-4 text-3xl font-semibold">{subtitle}</h2>
			<p class="max-w-3xl">{description}</p>
		</div>
	</div>
</div>

<style lang="post-css">
	.gradient-bg {
		background-image: linear-gradient(#377d8c, rgba(0, 0, 0, 0.5)), var(--bg);
		@apply z-0 bg-bottom;
	}
</style>
