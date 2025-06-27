<script lang="ts">
	export let heading: string;
	export let boldcontent: string;
	export let content: string;
	export let subContent: string = '';
	export let primaryButton: { text: string; href: string };
	export let secondaryButton: { text: string; href: string; icon?: string } | null = null;
</script>

<div class="my-[20vh] flex flex-col items-center justify-center bg-gray-50 px-4">
	<div class="max-w-3xl text-center">
		<h1 class="text-votist-blue-dark mb-8 text-4xl font-bold">{heading}</h1>
		<p class="mb-6 text-lg text-gray-700">
			<span class="font-semibold">{boldcontent}</span>
			{content}
		</p>
		{#if subContent}
			<p class="mb-8 text-lg font-semibold text-gray-700">{subContent}</p>
		{/if}
		<div class="flex justify-center gap-4">
			<a href={primaryButton.href}>
				<button
					class="btn btn-lg bg-votist rounded-md px-8 py-5 text-lg font-medium text-white hover:scale-105"
				>
					{primaryButton.text}
				</button>
			</a>
			{#if secondaryButton}
				<a href={secondaryButton.href}>
					<button
						class="btn btn-lg bg-votist-blue-dark flex items-center gap-2 px-8 py-5 text-white hover:scale-105"
					>
						{#if secondaryButton.icon}
							<img src={secondaryButton.icon} alt="" class="h-6 w-6" />
						{/if}
						{secondaryButton.text}
					</button>
				</a>
			{/if}
		</div>
	</div>
</div>
