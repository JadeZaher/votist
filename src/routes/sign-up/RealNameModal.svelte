<script lang="ts">
  export let open = false;
</script>

{#if open}
<div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" on:click|self={() => open = false}>
  <div class="bg-[#167B9B] text-white rounded-lg p-6 max-w-md w-full">
    <h3 class="text-lg font-bold mb-4">Why Real Names?</h3>
    <p class="text-sm leading-relaxed">
      Votist requires real names to create a safe and accountable environment for meaningful civic discussions. 
      This ensures that every participant is a real person, reducing misinformation and bad-faith interactions. 
      However, your name is only visible to other verified members within the platform, maintaining privacy.
    </p>
    <div class="mt-6 flex justify-end">
      <button on:click={() => open = false} class="btn btn-ghost text-white hover:bg-white/10">
        Close
      </button>
    </div>
  </div>
</div>
{/if}
