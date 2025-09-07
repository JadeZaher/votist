<script lang="ts">
	import PostEdit from '../../components/PostEdit.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mb-6">
	<h1 class="text-3xl font-bold">Edit Post</h1>
</div>

<div class="divider"></div>

<PostEdit post={data.post} />
