<script context="module" lang="ts">
	import type { ComponentType } from 'svelte';

	export interface Tab {
		id: string;
		label: string;
		icon?: ComponentType;
		href: string;
		bgColor?: string;
		textColor?: string;
	}
</script>

<script lang="ts">
	import { page } from '$app/stores';

	export let tabs: Tab[] = [];
	export let tabWidth: string = '254px';
</script>

<div role="tablist" class="tabs">
	{#each tabs as tab (tab.id)}
		<div class="tab-wrap" style:width={tabWidth}>
			<a
				role="tab"
				href={tab.href}
				class="tab relative flex h-[49px] items-center gap-2 pr-8 pl-6 transition-colors"
				style:width={tabWidth}
				class:active-tab={$page.url.pathname === tab.href}
				class:inactive-tab={$page.url.pathname !== tab.href}
			>
				{#if tab.icon}
					<div
						class="h-6 w-6"
						style:color={$page.url.pathname === tab.href
							? 'var(--color-base-100)'
							: 'var(--color-base-content)'}
					>
						<svelte:component this={tab.icon} />
					</div>
				{/if}
				<span class="text-[1.5em] leading-[1em]">
					{tab.label}
				</span>
			</a>
		</div>
	{/each}
</div>

<style>
	/* Tab Wrap is for the shadow, so it's not affected by the clipping of the tab */
	.tab-wrap {
		position: relative;
		filter: drop-shadow(6px 0 4px rgba(0, 0, 0, 0.25));
		clip-path: polygon(0 0, 100% 0, 105% 49px, 0 49px);
	}

	.tab {
		clip-path: path(
			'M0 14v39h254c-3.288-1.684-5-7.5-19-25-12.963-16.2033-20-24-31.553-24H10c-5.52285 0-10 4.4772-10 10z'
		);
		position: relative;
	}

	.active-tab {
		background: var(--color-votist-blue);
		color: var(--color-base-100);
		z-index: 10;
	}

	.inactive-tab {
		background: var(--color-base-200);
		color: var(--color-base-content);
	}
</style>
