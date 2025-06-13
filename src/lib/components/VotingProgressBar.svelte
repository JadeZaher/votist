<script lang="ts">
	export let yesVotes: number = 0;
	export let noVotes: number = 0;
	export let neutralVotes: number = 0;

	// Calculate total votes
	const totalVotes = yesVotes + noVotes + neutralVotes;

	// Calculate widths as percentages
	const yesWidth = totalVotes ? (yesVotes / totalVotes) * 100 : 0;
	const noWidth = totalVotes ? (noVotes / totalVotes) * 100 : 0;
	const neutralWidth = totalVotes ? (neutralVotes / totalVotes) * 100 : 0;
</script>

<div class="w-full overflow-hidden rounded-lg bg-gray-200">
	<div class="flex">
		<div class=" bg-secondar flex justify-center" style="width: {yesWidth}%;">
			<span class="text-white">{yesVotes}</span>
		</div>
		<div class="bg-votist-blue flex justify-center" style="width: {noWidth}%;">
			<span class="text-white">{noVotes}</span>
		</div>
		<div class="flex justify-center bg-blue-400" style="width: {neutralWidth}%;">
			<span class="text-white">{neutralVotes}</span>
		</div>
	</div>
</div>
