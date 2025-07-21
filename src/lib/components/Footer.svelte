<script>
	import logoHeader from '$lib/assets/logo/logo-header.png';
</script>

<footer class="mt-auto w-full border-t border-gray-200 bg-white">
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		<div class="flex w-full flex-col items-center justify-between md:flex-row">
			<!-- Left: Logo -->
			<div
				class="mb-4 flex w-full flex-shrink-0 items-center justify-center md:mb-0 md:w-auto md:justify-start"
			>
				<img src={logoHeader} alt="Votist logo" class="h-8 w-auto" />
			</div>
			<!-- Center: Links -->
			<div class="mb-4 flex w-full flex-wrap justify-center gap-6 md:mb-0 md:w-auto">
				<a href="/tos" class="text-sm text-gray-600 hover:text-gray-900">ToS</a>
				<a href="/privacy" class="text-sm text-gray-600 hover:text-gray-900">Privacy</a>
				<a href="/about" class="text-sm text-gray-600 hover:text-gray-900">What is votist</a>
				<a href="/feedback" class="text-sm text-gray-600 hover:text-gray-900">Your Feedback</a>
			</div>
			<!-- Right: Support -->
			<div class="flex w-full flex-shrink-0 items-center justify-center md:w-auto md:justify-end">
				<span class="cursor-pointer text-sm text-gray-600 hover:text-gray-900">Support</span>
			</div>
		</div>
	</div>
</footer>
