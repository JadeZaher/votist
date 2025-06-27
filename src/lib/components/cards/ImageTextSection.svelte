<script lang="ts">
	export let heading: string;
	export let content: string;
	export let imageUrl: string;
	export let imageAlt: string;
	export let buttonText: string;
	export let buttonHref: string;
	export let imageOnLeft: boolean = true;
</script>

<div class="flex min-h-[600px] items-center bg-gray-50 px-8 py-[10vh]">
	<div class="mx-auto flex max-w-[80vw] items-center gap-12">
		{#if imageOnLeft}
			<div class="mr-[10vw] flex-1">
				<img src={imageUrl} alt={imageAlt} class="w-full max-w-xl rounded-lg shadow-lg" />
			</div>
		{/if}

		<div class="flex-1 space-y-6">
			<h2 class="text-votist-blue-dark text-3xl font-bold">
				{heading}
			</h2>
			<p class="text-lg text-gray-700">
				{content}
			</p>

			<div>
				<a href={buttonHref}>
					<button
						class="bg-votist-blue hover:bg-votist-blue/90 btn btn-lg rounded-md px-8 py-3 text-lg font-medium text-white transition-colors"
					>
						{buttonText}
					</button>
				</a>
			</div>
		</div>

		{#if !imageOnLeft}
			<div class="ml-[10vw] flex-1">
				<img src={imageUrl} alt={imageAlt} class="w-full max-w-xl rounded-lg shadow-lg" />
			</div>
		{/if}
	</div>
</div>
