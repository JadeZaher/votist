<script lang="ts">
  import { signupStore } from './signup-store';
  import RealNameModal from './RealNameModal.svelte';

  export let nextStep: () => void;
  export let prevStep: () => void;
  
  let showModal = false;
  let firstName = $signupStore.firstName;
  let lastName = $signupStore.lastName;
  let error = '';

  function validate() {
    error = '';
    if (!firstName.trim() || !lastName.trim()) {
      error = 'Please enter your full name';
      return false;
    }
    return true;
  }

  function handleNext() {
    if (!validate()) return;
    // Store updated automatically via bindings
    nextStep();
  }
</script>

<div class="space-y-6">
  <div class="space-y-4">
    <div class="text-[#167B9B] text-sm mb-4">
      Votist requires real names. <button on:click={() => showModal = true} class="font-medium hover:underline">Why?</button>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="form-control">
        <label class="label">
          <span class="label-text text-[#1E1E1E] font-medium">First Name</span>
        </label>
        <input
          type="text"
          class="input input-bordered w-full"
          placeholder="Enter your first name"
          bind:value={firstName}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text text-[#1E1E1E] font-medium">Last Name</span>
        </label>
        <input
          type="text"
          class="input input-bordered w-full"
          placeholder="Enter your last name"
          bind:value={lastName}
        />
      </div>
    </div>
  </div>

  {#if error}
    <div class="text-red-600 text-sm">{error}</div>
  {/if}

  <div class="flex justify-between">
    <button on:click={prevStep} class="btn btn-ghost text-[#167B9B] hover:bg-gray-100">
      Back
    </button>
    <button on:click={handleNext} class="btn bg-[#167B9B] hover:bg-[#155E75] text-white">
      Next
    </button>
  </div>
</div>

<RealNameModal bind:open={showModal} />
