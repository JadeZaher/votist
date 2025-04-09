<script lang="ts">
  import logo from '$lib/assets/logo/logo-white.png';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let email = '';
  let password = '';
  let birthDate = '';
  
  const handleNext = () => {
    // Validate form fields
    if (!email || !password || !birthDate) {
      alert("Please fill all the required fields");
      return;
    }
    
    // Store entered data in session storage for now
    sessionStorage.setItem('loginEmail', email);
    sessionStorage.setItem('loginPassword', password);
    sessionStorage.setItem('loginBirthDate', birthDate);
    
    // Move to dashboard or next step if needed
    goto('/dashboard');
  };
  
  const handleContact = () => {
    // Handle contact support logic
  };
</script>

<div class="flex min-h-screen  fixed w-full h-full top-0 bg-white">
  <div class="w-1/3 bg-teal-700 flex items-center justify-center">
    <img src={logo} alt="Votist Logo" class="w-40" />
  </div>
  
  <div class="w-2/3 flex items-center justify-center text-2xl">
    <div class="w-full max-w-md px-4">
      <h2 class="text-xl font-medium mb-1">Step 1 of 3</h2>
      <h1 class="text-3xl font-bold mb-6">Login Details</h1>
      
      <div class="mb-4">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">Email</label>
        <input 
          type="email" 
          bind:value={email}
          placeholder="Enter your email address"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="mb-4">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">Password</label>
        <input 
          type="password" 
          bind:value={password}
          placeholder="Choose a password"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="mb-6">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">Your birth date</label>
        <input 
          type="text" 
          bind:value={birthDate}
          placeholder="00/00/0000"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="text-xs text-gray-600 mb-6">
        By creating an account you agree to the <a href="/terms" class="text-teal-600">Terms of Service</a> and <a href="/privacy" class="text-teal-600">Privacy Policy</a>
      </div>
      
      <div class="flex justify-end">
        <button 
          on:click={handleNext}
          class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition  shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          Next
        </button>
      </div>
      
      <div class="border-t border-gray-200 mt-8 pt-6 text-center">
        <p>Having trouble? <button on:click={handleContact} class="text-teal-600">Contact support</button></p>
      </div>
    </div>
  </div>
</div>