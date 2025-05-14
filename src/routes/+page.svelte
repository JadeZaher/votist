<script lang="ts">
	import logo from '$lib/assets/logo/votist-logo.png';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-[#1B4D5C] text-white">
	<div class="flex flex-col items-center justify-center space-y-4">
		<img src={logo} alt="Votist Logo" class="logo-white w-32" />
		<h1 class="text-center text-2xl font-light">
			The platform for solution-driven civic engagement
		</h1>
		<p class="text-center text-sm">Proof of Concept, Summer 2025</p>
		<a href="/learn-more" class="mt-8">
			<button class="hover:bg-opacity-90 rounded-full bg-white px-6 py-2 text-[#1B4D5C]">
				Learn more
			</button>
		</a>
	</div>
	<div class="absolute bottom-8 text-center text-sm">
		<p>Votist is a project of Translucent Studios LLC</p>
	</div>
</div>

<style>
	.logo-white {
		filter: brightness(0) invert(1);
	}
</style>
