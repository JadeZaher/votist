<script lang="ts">
  import logo from '$lib/assets/logo/logo-white.png';
  import { goto } from '$app/navigation';
  
  let phone = '';
  let isHuman = false;
  
  const handleNext = () => {
    // Validate form fields
    if (!phone) {
      alert("Please enter your phone number");
      return;
    }
    
    if (!isHuman) {
      alert("Please confirm you are human");
      return;
    }
    
    // Store entered data in session storage for now
    sessionStorage.setItem('registerPhone', phone);
    
    // Complete registration and redirect to dashboard
    goto('/dashboard');
  };
</script>

<div class="flex min-h-screen  fixed w-full h-full top-0 bg-white">
  <div class="w-1/3 bg-teal-700 flex items-center justify-center">
    <img src={logo} alt="Votist Logo" class="w-40" />
  </div>
  
  <div class="w-2/3 flex items-center justify-center text-2xl">
    <div class="w-full max-w-md px-4">
      <div class="text-red-500 mb-4 text-lg">
        Harsoft team, I'm not sure what you've decided
        for secure login. Phone number? Or some other method?
      </div>
      
      <h2 class="text-xl font-medium mb-1">Step 3 of 3</h2>
      <h1 class="text-3xl font-bold mb-6">Phone number .... or</h1>
      
      <div class="mb-8">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">?</label>
        <input 
          type="text" 
          bind:value={phone}
          placeholder="Phone"
          class="w-full px-3 py-2 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      
      <div class="mb-6">
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label class="block text-gray-700 mb-2">?</label>
        <div class="flex items-center">
          <input 
            type="checkbox" 
            bind:checked={isHuman}
            id="humanCheckbox"
            class="mr-2"
          />
          <label for="humanCheckbox" class="text-sm">I am human</label>
          <div class="ml-auto">
            <div class="border rounded px-2 py-1 text-xs bg-teal-100">
              hCaptcha
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end">
        <button 
          on:click={handleNext}
          class="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-500 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>