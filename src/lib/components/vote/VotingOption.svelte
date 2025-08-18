<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let option: {
		id: number;
		text: string;
		votes: number;
	};
	export let hasVoted: boolean = false;
	export let selectedOption: number | null = null;
	export let totalVotes: number = 0;

	const dispatch = createEventDispatcher<{
		vote: { optionId: number };
	}>();

	function handleVote() {
		if (hasVoted) return;
		dispatch('vote', { optionId: option.id });
	}

	function getPercentage(votes: number): number {
		return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
	}
</script>

<div
	class="rounded-lg border-2 border-gray-200 bg-white p-4 transition-all duration-200 hover:border-[#167b9b] hover:shadow-md
	{hasVoted ? 'cursor-default' : 'cursor-pointer'}
	{selectedOption === option.id ? 'border-[#167b9b] bg-blue-50' : ''}"
	on:click={handleVote}
	on:keydown={(e) => e.key === 'Enter' && handleVote()}
	role="button"
	tabindex="0"
>
	<div class="flex items-center justify-between">
		<div class="flex-1">
			<p class="text-base font-medium text-gray-800">
				{option.text}
			</p>

			{#if hasVoted}
				<!-- Progress bar for results -->
				<div class="mt-3">
					<div class="mb-1 flex justify-between text-sm text-gray-600">
						<span>{getPercentage(option.votes)}%</span>
						<span>{option.votes} votes</span>
					</div>
					<div class="h-2 w-full rounded-full bg-gray-200">
						<div
							class="h-2 rounded-full bg-[#167b9b] transition-all duration-500"
							style="width: {getPercentage(option.votes)}%"
						></div>
					</div>
				</div>
			{/if}
		</div>

		{#if !hasVoted}
			<div class="ml-4 text-2xl font-bold text-gray-400">
				{option.votes}
			</div>
		{/if}
	</div>
</div>
