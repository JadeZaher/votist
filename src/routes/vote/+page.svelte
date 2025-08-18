<script lang="ts">
	import VoteHeader from '$lib/components/vote/VoteHeader.svelte';
	import VoteTitleSection from '$lib/components/vote/VoteTitleSection.svelte';
	import VoteQuestion from '$lib/components/vote/VoteQuestion.svelte';
	import VotingOption from '$lib/components/vote/VotingOption.svelte';
	import VoteStatusMessage from '$lib/components/vote/VoteStatusMessage.svelte';
	import DiscussionSection from '$lib/components/vote/DiscussionSection.svelte';

	// Mock data for the poll
	let votingOptions = [
		{
			id: 1,
			text: 'Yes, San Rafael should build significantly more housing.',
			votes: 30
		},
		{
			id: 2,
			text: 'Yes, but only where housing fits the character and scale of the community.',
			votes: 10
		},
		{
			id: 3,
			text: 'No, San Rafael should focus on limiting housing growth. Fight State mandates!',
			votes: 3
		},
		{
			id: 4,
			text: 'Other solutions/No Opinion',
			votes: 3
		}
	];

	let hasVoted = false;
	let selectedOption: number | null = null;
	let userVotePower = 2;
	let totalVotes = votingOptions.reduce((sum, option) => sum + option.votes, 0);

	function handleVote(event: CustomEvent<{ optionId: number }>) {
		const { optionId } = event.detail;

		if (hasVoted) return;

		selectedOption = optionId;
		hasVoted = true;

		// Update the vote count for the selected option
		votingOptions = votingOptions.map((option) =>
			option.id === optionId ? { ...option, votes: option.votes + userVotePower } : option
		);

		// Recalculate total votes
		totalVotes = votingOptions.reduce((sum, option) => sum + option.votes, 0);
	}
</script>

<div class="min-h-screen bg-white p-6">
	<div class="mx-auto max-w-2xl">
		<VoteTitleSection title="San Rafael" subtitle="Housing and the Future" {userVotePower} />

		<VoteQuestion question="Should San Rafael encourage more housing development?" />

		<!-- Voting Options -->
		<div class="space-y-4">
			{#each votingOptions as option}
				<VotingOption {option} {hasVoted} {selectedOption} {totalVotes} on:vote={handleVote} />
			{/each}
		</div>

		<VoteStatusMessage {hasVoted} {userVotePower} {totalVotes} />

		<!-- Discussion Section - Only show after voting -->
		{#if hasVoted}
			<DiscussionSection />
		{/if}
	</div>
</div>
