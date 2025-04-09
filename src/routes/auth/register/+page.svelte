<script lang="ts">
  import logo from '$lib/assets/logo/logo-white.png';
  import { goto } from '$app/navigation';
  
  let firstName = '';
  let lastName = '';
  let pseudonym = '';
  
  const handleNext = () => {
    // Validate form fields
    if (!firstName || !lastName) {
      alert("Please enter your first and last name");
      return;
    }
    
    // Store entered data in session storage for now
    sessionStorage.setItem('registerFirstName', firstName);
    sessionStorage.setItem('registerLastName', lastName);
    if (pseudonym) {
      sessionStorage.setItem('registerPseudonym', pseudonym);
    }
    
    // Move to step 3
    goto('/auth/register/phone');
  };
  
  const handleWhyClick = () => {
    // Show explanation about why real names are required
    alert("Real names are required for verification purposes and to maintain the integrity of the platform.");
  };
</script>

<div class="flex min-h-screen  fixed w-full h-full top-0 bg-white">
  <div class="w-1/3 bg-teal-700 flex items-center justify-center">
    <img src={logo} alt="Votist Logo" class="w-40" />
  </div>
  
  <div class="w-2/3 flex items-center justify-center text-2xl">
    <div class="w-full max-w-md px-4">
      <h2 class="text-xl font-medium mb-1">Step 2 of 3</h2>
      <h1 class="text-3xl font-bold mb-6">Your First and Last Name</h1>
      
      <div class="flex items-center mb-8">
        <span class="text-lg">Votist requires real names.</span>
        <button on:click={handleWhyClick} class="ml-1 text-lg text-blue-500 underline">Why?</button>
      </div>
      
      <div class="mb-8">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">First</label>
        <input 
          type="text" 
          bind:value={firstName}
          placeholder="First name"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="mb-8">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">Last</label>
        <input 
          type="text" 
          bind:value={lastName}
          placeholder="Last name"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="mb-6">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">A Pseudonym for Non-Members</label>
        <input 
          type="text" 
          bind:value={pseudonym}
          placeholder="Pseudonym"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="flex justify-end">
        <button 
          on:click={handleNext}
          class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition  shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>