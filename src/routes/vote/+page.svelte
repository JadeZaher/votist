<script lang="ts">
	import PollFeed from '$lib/components/vote/PollFeed.svelte';
	export let data;
</script>

<div class="min-h-screen bg-gray-50">
	<PollFeed polls={data.polls} isAuthenticated={data.isAuthenticated} user={data.user} />
</div>
