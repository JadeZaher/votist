<script lang="ts">
    import type { PageData } from './$types';
    import QuizEdit from '../../components/QuizEdit.svelte';

    export let data: PageData;
    
    console.log('Page data:', data);
</script>

{#if !data.quiz}
    <div class="flex justify-center p-4">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{:else}
    <QuizEdit quiz={data.quiz} />
{/if}