<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let firstName = '';
    let lastName = '';
    let pseudonym = '';
    let error = '';
    let showWhyInfo = false;
    let isValidForm = false;
    
    // Check if user completed step 1
    onMount(() => {
      const signupData = sessionStorage.getItem('signupData');
      if (!signupData) {
        goto('/signup/step1');
      }
    });
    
    // Form validation
    $: {
      isValidForm = firstName.trim() !== '' && lastName.trim() !== '';
    }
    
    function handleNext() {
      if (!isValidForm) {
        error = 'Please provide your first and last name';
        return;
      }
      
      try {
        // Get existing data and add new data
        const existingData = JSON.parse(sessionStorage.getItem('signupData') || '{}');
        sessionStorage.setItem('signupData', JSON.stringify({
          ...existingData,
          firstName,
          lastName,
          pseudonym: pseudonym || `${firstName.charAt(0)}${lastName.charAt(0)}`
        }));
        goto('/signup/step3');
      } catch (error) {
        console.error("Error storing data:", error);
      }
    }
    
    function toggleWhyInfo() {
      showWhyInfo = !showWhyInfo;
    }
  </script>
  
  <div class="flex h-screen">
    <div class="w-1/4 bg-[#1a5e74] flex items-center justify-center">
      <img src="/votist-logo.svg" alt="Votist" class="h-12" />
    </div>
    
    <div class="w-3/4 flex items-center justify-center">
      <div class="w-full max-w-md px-4">
        <div class="mb-6">
          <p class="text-sm text-gray-600">Step 2 of 3</p>
          <h1 class="text-2xl font-bold">Your First and Last Name</h1>
          <div class="flex items-center">
            <p>Votist requires real names.</p>
            <button on:click={toggleWhyInfo} class="ml-1 text-red-500">Why?</button>
          </div>
        </div>
        
        {#if error}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        {/if}
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">First</label>
            <input 
              type="text" 
              bind:value={firstName}
              placeholder="First name"
              class="w-full p-3 bg-gray-100 rounded border border-gray-200"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Last</label>
            <input 
              type="text" 
              bind:value={lastName}
              placeholder="Last name"
              class="w-full p-3 bg-gray-100 rounded border border-gray-200"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">A Pseudonym for Non-Members</label>
            <input 
              type="text" 
              bind:value={pseudonym}
              placeholder="Pseudonym"
              class="w-full p-3 bg-gray-100 rounded border border-gray-200"
            />
            <p class="text-xs text-gray-500 mt-1">Optional - we'll create one for you if left blank</p>
          </div>
          
          <div class="flex justify-end">
            <button 
              on:click={handleNext}
              class="px-8 py-2 bg-[#1a5e74] text-white rounded"
              disabled={!isValidForm}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
    
    {#if showWhyInfo}
    <div class="w-1/4 bg-black text-white p-4">
      <div class="bg-[#1a5e74] p-4 rounded">
        <p>Votist requires real names to create a safe and accountable environment for meaningful civic discussions. This ensures that every participant is a real person, reducing misinformation and bad-faith interactions. However, your name is only visible to other verified members within the platform, maintaining privacy.</p>
      </div>
    </div>
    {:else}
    <div class="w-1/4 bg-black"></div>
    {/if}
  </div>