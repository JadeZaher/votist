<script lang="ts">
  export let thisModalIsOpen: boolean = false;
</script>

{#if thisModalIsOpen}
  <div class="bg-opacity-50 fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black">
    <div class="relative">
      <slot name="clickable" />
      <button on:click={() => (thisModalIsOpen = false)} class="absolute">
        <slot name="closeButton" />
      </button>
      <slot />
    </div>
  </div>
{/if}