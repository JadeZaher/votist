<script lang="ts">
	export let hasVoted: boolean = false;
	export let userVotePower: number = 2;
	export let totalVotes: number = 0;
</script>

{#if hasVoted}
	<div class="mt-8 rounded-lg border border-green-200 bg-green-50 p-4">
		<div class="flex items-center gap-2">
			<span class="text-green-600">✓</span>
			<p class="font-medium text-green-800">
				Thank you for voting! Your vote has been recorded with +{userVotePower} voting power.
			</p>
		</div>
		<p class="mt-2 text-sm text-green-700">
			Total votes: {totalVotes}
		</p>
	</div>
{:else}
	<div class="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
		<p class="text-sm text-blue-800">
			<strong>Note:</strong> Your vote will be weighted by your current voting power (+{userVotePower}).
			Complete more quizzes to increase your voting power.
		</p>
	</div>
{/if}
