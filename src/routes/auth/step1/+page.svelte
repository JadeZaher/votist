<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    
    let email = '';
    let password = '';
    let birthdate = '';
    let error = '';
    let isValidForm = false;
    
    // Form validation
    $: {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(email);
      const isPasswordValid = password.length >= 8;
      const isBirthdateValid = /^\d{2}\/\d{2}\/\d{4}$/.test(birthdate);
      
      isValidForm = isEmailValid && isPasswordValid && isBirthdateValid;
    }
    
    function handleNext() {
      if (!isValidForm) {
        error = 'Please fill all fields correctly';
        return;
      }
      
      // Store data in sessionStorage (more secure than localStorage)
      sessionStorage.setItem('signupData', JSON.stringify({ email, password, birthdate }));
      goto('/signup/step2');
    }
    
    function contactSupport() {
      // Contact support functionality
      window.location.href = "mailto:support@votist.com";
    }
  </script>
  
  <div class="flex h-screen">
    <div class="w-1/4 bg-[#1a5e74] flex items-center justify-center">
      <img src="/votist-logo.svg" alt="Votist" class="h-12" />
    </div>
    
    <div class="w-3/4 flex items-center justify-center">
      <div class="w-full max-w-md px-4">
        <div class="mb-6">
          <p class="text-sm text-gray-600">Step 1 of 3</p>
          <h1 class="text-2xl font-bold">Login Details</h1>
        </div>
        
        {#if error}
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        {/if}
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              bind:value={email}
              placeholder="Enter your email address"
              class="w-full p-3 bg-gray-100 rounded border border-gray-200"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              bind:value={password}
              placeholder="Choose a password"
              class="w-full p-3 bg-gray-100 rounded border border-gray-200"
            />
            <p class="text-xs text-gray-500 mt-1">Password must be at least 8 characters</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Your birth date</label>
            <input 
              type="text" 
              bind:value={birthdate}
              placeholder="MM/DD/YYYY"
              class="w-full p-3 bg-gray-100 rounded border border-gray-200"
            />
          </div>
          
          <p class="text-xs text-gray-600">
            By creating an account you agree to the 
            <a href="/terms" class="text-blue-500">Terms of Service</a> and
            <a href="/privacy" class="text-blue-500">Privacy Policy</a>.
          </p>
          
          <div class="flex justify-end">
            <button 
              on:click={handleNext}
              class="px-8 py-2 bg-[#1a5e74] text-white rounded"
              disabled={!isValidForm}>
              Next
            </button>
          </div>
        </div>
        
        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-center">
            Having trouble? <button on:click={contactSupport} class="text-blue-500">Contact support</button>
          </p>
        </div>
      </div>
    </div>
  </div>