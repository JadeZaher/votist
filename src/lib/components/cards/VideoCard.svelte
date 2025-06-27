<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Player from '@vimeo/player';

	let {
		videoId,
		startTime = $bindable(0)
	}: {
		videoId: string;
		startTime: number;
	} = $props();
	let videoTitle = 'Video player';
	let iframeSrc = $derived(`https://player.vimeo.com/video/${videoId}`);
	const playerId = `player-${videoId}`;

	let player: Player;

	onMount(() => {
		const vimeoId = parseInt(videoId, 10);
		player = new Player(playerId, {
			id: vimeoId,
			width: '100%',
			autoplay: true
		});
	});
	onDestroy(async () => {
		if (player) {
			try {
				const currentTime = await player.getCurrentTime();
				startTime = currentTime;
				console.log(startTime);
			} catch (error) {
				console.error('Error getting current time:', error);
			}
		}
	});
</script>

{#if videoId}
	<iframe
		id={playerId}
		class="min-h-[70vh] w-screen rounded-md duration-700"
		src={iframeSrc}
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		webkitallowfullscreen
		allowfullscreen
		mozallowfullscreen
		title={videoTitle}
	></iframe>
{:else}
	<p></p>
{/if}

<style>
	iframe {
		max-width: 100%;
		height: 100%;
	}
</style>
