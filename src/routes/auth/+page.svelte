<script lang="ts">
  import logo from '$lib/assets/logo/logo-white.png';
  import { goto } from '$app/navigation';

  const handleNewMembership = () => {
    goto('/auth/register');
  };

  const handleSignIn = () => {
    goto('/auth/login');
  };

  const handleAnonymous = () => {
    // Handle anonymous login logic here
    goto('/dashboard');
  };
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-teal-700 fixed w-full h-full top-0 ">
  <div class="mb-16">
    <img src={logo} alt="Votist Logo" class="w-40" />
  </div>
  
  <div class="w-full max-w-xs flex flex-col gap-4 text-2xl">
    <button 
      on:click={handleNewMembership}
      class="w-full py-2 bg-teal-600 text-white rounded-lg border border-teal-500 hover:bg-teal-500 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
    >
      New Membership
    </button>
    
    <button 
      on:click={handleSignIn}
      class="w-full py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
    >
      Sign In
    </button>
    
    <button 
      on:click={handleAnonymous}
      class="w-2/3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition mt-16 mx-auto text-xl shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]"
    >
      Anonymous
    </button>
  </div>
</div>