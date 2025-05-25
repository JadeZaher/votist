<script lang="ts">
	import { levels } from '../../../stores/quizStore';
</script>

<h3 class="flex items-center text-xl font-bold text-teal-900">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="mr-2 h-8 w-8 text-teal-700"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
		/>
	</svg>
	Levels

	<span class="ml-4 text-sm text-teal-600">(Gain Votes and Powers)</span>
</h3>

<div class="mt-4">
	{#each $levels as level, index}
		<div class="relative border-l-4 {index < 3 ? 'border-teal-700' : 'border-gray-300'} pb-12 pl-6">
			<div
				class="absolute top-0 left-0 -ml-4 h-8 w-8 rounded-full {index < 3
					? 'bg-teal-700'
					: 'bg-yellow-500'} flex items-center justify-center font-bold text-white"
			>
				{level.number}
			</div>
			<p class="text-sm font-medium text-teal-500">{level.title}</p>
		</div>
	{/each}
</div>
