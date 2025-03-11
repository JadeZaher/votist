<script lang="ts">
  import logo from '$lib/assets/logo/votist-logo.png';
</script>

  

  <div class="">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-teal-700 mb-2">Knowledge is Power</h1>
      <img src={logo} alt="Votist Logo" class="h-20 mx-auto" />
    </div>
    <!-- Location Title with Badges -->
    <div class="text-center mb-8">
      <h2 class="text-5xl font-bold text-teal-700 mb-6">San Rafael, Location</h2>
      <div class="flex justify-center gap-4">
        <div class="flex items-center">
          <div class="bg-yellow-400 text-white rounded-full p-2 mr-2">
            <span class="w-6 h-6 flex items-center justify-center">V</span>
          </div>
          <span class="text-2xl text-teal-700">+1 Vote</span>
        </div>
        <div class="flex items-center">
          <div class="bg-yellow-400 text-white rounded-full p-2 mr-2">
            <span class="w-6 h-6 flex items-center justify-center">K</span>
          </div>
          <span class="text-2xl text-teal-700">+1 Knowledge</span>
        </div>
      </div>
    </div>

    <!-- Start Button -->
    <div class="flex justify-center mb-16">
      <button class="bg-teal-700 text-white text-3xl font-semibold py-4 px-12 rounded-lg shadow-md hover:bg-teal-800 transition-colors">
        Start
      </button>
    </div>

    
  </div>