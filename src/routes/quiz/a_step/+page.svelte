<script lang="ts">
	import logo from '$lib/assets/logo/votist-logo.png';
</script>

<div class="">
	<div class="mb-8 text-center">
		<h1 class="mb-2 text-3xl font-bold text-teal-700">Knowledge is Power</h1>
		<img src={logo} alt="Votist Logo" class="mx-auto h-20" />
	</div>
	<!-- Location Title with Badges -->
	<div class="mb-8 text-center">
		<h2 class="mb-6 text-5xl font-bold text-teal-700">San Rafael, Location</h2>
		<div class="flex justify-center gap-4">
			<div class="flex items-center">
				<div class="mr-2 rounded-full bg-yellow-400 p-2 text-white">
					<span class="flex h-6 w-6 items-center justify-center">V</span>
				</div>
				<span class="text-2xl text-teal-700">+1 Vote</span>
			</div>
			<div class="flex items-center">
				<div class="mr-2 rounded-full bg-yellow-400 p-2 text-white">
					<span class="flex h-6 w-6 items-center justify-center">K</span>
				</div>
				<span class="text-2xl text-teal-700">+1 Knowledge</span>
			</div>
		</div>
	</div>

	<!-- Start Button -->
	<div class="mb-16 flex justify-center">
		<button
			class="rounded-lg bg-teal-700 px-12 py-4 text-3xl font-semibold text-white shadow-md transition-colors hover:bg-teal-800"
		>
			Start
		</button>
	</div>
</div>
