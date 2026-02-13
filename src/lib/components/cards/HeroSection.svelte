<script lang="ts">
	import sanRafael from '$lib/assets/home/san-raph-hero.png';
	import play from '$lib/assets/icons/playbutton.png';
</script>

<div class="relative min-h-[70vh] md:min-h-screen">
	<div class="absolute inset-0">
		<img
			src={sanRafael}
			alt="San Rafael Landscape"
			class="h-full w-full object-cover brightness-[0.4]"
		/>
	</div>

	<div class="relative z-10 flex min-h-[70vh] items-center px-6 py-12 text-white md:min-h-screen md:px-12 lg:px-20">
		<div class="flex w-full flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
			<div class="max-w-2xl flex-1">
				<p class="mb-3 text-sm font-light tracking-wider uppercase md:text-lg">San Rafael, California</p>
				<h1 class="mb-4 text-3xl leading-tight font-bold md:mb-6 md:text-5xl lg:text-6xl">
					Growth, Housing,<br />and the Future
				</h1>
				<p class="mb-6 max-w-xl text-sm leading-relaxed text-gray-200 md:mb-8 md:text-lg md:text-white">
					San Rafael is at a crossroads. With rising costs pushing young families away and
					essential workers struggling to find homes, the need for change is urgent. To
					accommodate over 10,000 new residents by 2040 while addressing infrastructure
					challenges, we must act now.
				</p>
				<a
					href="/vote"
					class="inline-block rounded-lg bg-[#0891B2] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#0891B2]/90 md:px-8 md:text-lg"
				>
					Vote for change
				</a>
			</div>
			<div class="hidden md:flex md:flex-1 md:justify-center">
				<button
					type="button"
					class="group transition-transform hover:scale-110"
					onclick={() => {}}
				>
					<img
						src={play}
						alt="Play video"
						class="h-16 w-16 opacity-80 transition-opacity group-hover:opacity-100 lg:h-24 lg:w-24"
					/>
				</button>
			</div>
		</div>
	</div>
</div>
