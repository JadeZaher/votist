<script lang="ts">
	import sanRafael from '$lib/assets/home/san-raph-hero.png';
	import play from '$lib/assets/icons/playbutton.png';
</script>

<div class="relative min-h-screen">
	<div class="absolute inset-0">
		<img
			src={sanRafael}
			alt="San Rafael Landscape"
			class="h-full w-full object-cover brightness-50"
		/>
	</div>

	<div class="relative z-10 flex min-h-screen items-center px-8 py-12 text-white">
		<div class="flex w-full items-center justify-between">
			<div class="ml-[10%] flex-1">
				<p class="mb-4 text-lg font-light">San Rafael, California</p>
				<h1 class="mb-6 text-5xl leading-tight font-bold">
					Growth, Housing,<br />
					and the Future
				</h1>
				<div class="max-w-2xl">
					<p class="mb-8 text-lg">
						San Rafael is at a crossroads. With rising costs pushing young families away and
						essential workers struggling to find homes, the need for change is urgent. To
						accommodate over 10,000 new residents by 2040 while addressing infrastructure
						challenges, we must act now.
					</p>
					<button
						class="rounded-md bg-[#0891B2] px-8 py-3 text-lg font-medium text-white transition-colors hover:bg-[#0891B2]/90"
					>
						Vote for change
					</button>
				</div>
			</div>
			<div class="flex flex-1 justify-center">
				<button
					type="button"
					class="group transition-transform hover:scale-110"
					on:click={() => {}}
				>
					<img
						src={play}
						alt="Play video"
						class="h-24 w-24 opacity-80 transition-opacity group-hover:opacity-100"
					/>
				</button>
			</div>
		</div>
	</div>
</div>
