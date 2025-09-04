<script lang="ts">
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
	const { wordpressCSS } = data;
</script>

<svelte:head>
	{@html `<` + `style>${wordpressCSS}</style>`}
</svelte:head>
{@render children?.()}
