<script lang="ts">
	export let title: string = 'San Rafael';
	export let subtitle: string = 'Housing and the Future';
	export let userVotePower: number = 2;
</script>

<div class="mb-8">
	<h2 class="mb-2 text-4xl font-bold text-[#167b9b]">{title}</h2>
	<h3 class="mb-4 text-2xl font-medium text-[#167b9b]">{subtitle}</h3>
	<p class="text-lg">
		<span class="font-medium">My Current Vote Power:</span>
		<span class="font-bold text-[#f9d026]">Votist +{userVotePower}</span>
	</p>
</div>
