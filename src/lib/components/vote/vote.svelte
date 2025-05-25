<script lang="ts" context="module">
	export interface VoteOption {
		id: number;
		text: string;
		votes: number;
		selected?: boolean;
	}

	export interface VoteQuestion {
		id: string;
		title: string;
		description?: string;
		options: VoteOption[];
	}
</script>

<script lang="ts">
	import VotistIcon from '$lib/components/VotistIcon.svelte';
	import VotistCheckYes from '$com/VotistCheckYes.svelte';

	export let question: VoteQuestion;
	export let userVotePower: number = 0;
	export let showStats: boolean = true;

	let selectedOption: number | null = null;

	function handleVote(optionId: number) {
		selectedOption = optionId;
	}
</script>

<div class="card bg-base-100 w-full">
	<div class="card-body">
		<!-- Question Header -->
		<div class="mb-8">
			<div class="mb-2 flex items-center gap-4">
				<h2 class="text-secondary text-4xl font-bold">
					{question.title}
				</h2>
			</div>
			{#if question.description}
				<p class="text-base-content/80 mt-4 text-xl">
					{question.description}
				</p>
			{/if}
		</div>

		<!-- Grid of Voting Options -->
		<div
			class="bg-base-200/50 mx-auto w-[48rem] rounded-lg border border-[#D0D0D0] p-6"
			style="border-width: 0.7px"
		>
			<div class="grid grid-cols-2 gap-6">
				{#each question.options as option, i}
					<button
						type="button"
						class="grid h-auto min-h-[8rem] grid-cols-[auto_1fr_auto] items-center gap-4 border-2 p-6 w-full bg-base-100 rounded-lg"
						class:hover:bg-base-200={!selectedOption || selectedOption !== option.id}
						class:no-animation={selectedOption === option.id}
						class:border-primary={selectedOption === option.id}
						class:bg-opacity-10={selectedOption === option.id}
						class:bg-primary={selectedOption === option.id}
						on:click={() => handleVote(option.id)}
						role="radio"
						aria-checked={selectedOption === option.id}
					>
						<!-- Icon -->
						{#if selectedOption === option.id}
							<div class="flex w-8 items-center justify-center">
								<VotistCheckYes size={24} />
							</div>
						{:else}
							<div class="w-0"></div>
						{/if}

						<!-- Text -->
						<p
							class="text-left {selectedOption === option.id
								? 'text-base-100'
								: 'text-base-content'}"
						>
							{option.text}
						</p>

						<!-- Votes -->
						<div class="flex items-center gap-2">
							<span class="text-xl font-medium {selectedOption === option.id ? 'text-base-100' : 'text-base-content'}">
								{option.votes}
							</span>
							{#if selectedOption === option.id}
								<span class="text-warning text-sm font-bold -translate-y-2">+{userVotePower}</span>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		</div>
	</div>
</div>
