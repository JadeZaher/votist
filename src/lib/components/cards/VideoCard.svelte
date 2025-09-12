<script lang="ts">
	import { getVideoThumbnail, getVideoEmbedUrl } from '$lib/util/videoUtils';

	let {
		videoId,
		service = 'Vimeo'
	}: {
		videoId: string;
		service: 'YouTube' | 'Vimeo';
	} = $props();

	let showVideo = $state(false);

	// Use utility function for thumbnail URL
	const thumbnailUrl = $derived(() => getVideoThumbnail(videoId, service));

	// Use utility function for embed URL
	const embedUrl = $derived(() => getVideoEmbedUrl(videoId, service, { autoplay: true }));

	function playVideo() {
		showVideo = true;
	}
</script>

{#if videoId}
	<div class="w-full" style="aspect-ratio: 16/9;">
		{#if showVideo}
			<!-- Show video iframe after user clicks -->
			<iframe
				src={embedUrl()}
				class="h-full w-full rounded-md"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				allowfullscreen
				title="Video player"
			></iframe>
		{:else}
			<!-- Show thumbnail with play button overlay -->
			<button
				type="button"
				onclick={playVideo}
				class="relative h-full w-full cursor-pointer rounded-md border-none bg-transparent p-0 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				aria-label="Play video"
			>
				<img
					src={thumbnailUrl()}
					alt="Video thumbnail"
					class="h-full w-full rounded-md object-cover"
				/>
				<!-- Play button overlay -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div
						class="bg-opacity-70 hover:bg-opacity-90 flex h-16 w-16 items-center justify-center rounded-full bg-black transition-all duration-200 hover:scale-110"
					>
						<svg class="ml-1 h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				</div>
			</button>
		{/if}
	</div>
{:else}
	<div class="flex h-64 w-full items-center justify-center bg-gray-100 text-gray-500">
		No video available
	</div>
{/if}
