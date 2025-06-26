<script lang="ts">
	let { children } = $props();
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50">
	<div class="max-w-8xl w-full px-4">
		{@render children()}
	</div>
</div>
