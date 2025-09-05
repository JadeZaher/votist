<script lang="ts">
	let { data, children } = $props();
	const { wordpressCSS } = data;
</script>

<svelte:head>
	{@html `<` + `style>${wordpressCSS}</style>`}
</svelte:head>
{@render children?.()}
