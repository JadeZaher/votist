<script lang="ts">
  import logo from '$lib/assets/logo/votist-logo.png';
</script>

<div class="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50">
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-teal-700 mb-2">Knowledge is Power</h1>
    <img src={logo} alt="Votist Logo" class="h-20 mx-auto" />
  </div>

  <div class="w-full max-w-8xl px-4">
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

    <!-- Progress Tracker -->
    <div class="mt-12 px-4">
      <!-- Progress Labels -->
      <div class="flex justify-between mb-2">
        <div class="text-teal-700 font-bold">Votist</div>
        <div class="text-teal-700 font-bold">Scholar</div>
        <div class="text-teal-700 font-bold">Mentor</div>
      </div>

      <!-- Progress Bar -->
      <div class="relative">
        <div class="absolute top-1/2 w-full h-2 bg-teal-700 -translate-y-1/2"></div>
          <!-- Votist Section -->
          <div class="flex justify-between ">
            <div class="w-6 h-6 bg-gray-300 rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-gray-300 rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-gray-300 rounded-full border-teal-700 z-10"></div>

            <div class="w-6 h-6 bg-gray-500 rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-gray-500 rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-gray-500 rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-gray-500 rounded-full border-teal-700 z-10"></div>

            <div class="w-6 h-6 bg-black rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-black rounded-full border-teal-700 z-10"></div>
            <div class="w-6 h-6 bg-black rounded-full border-teal-700 z-10"></div>
          </div>
      </div>

      <!-- Quiz Labels -->
      <div class="grid grid-cols-10 mt-2 text-sm w-full text-center">
        <div class="text-teal-700">
          <p class="font-bold">Quiz 01</p>
          <p>Location</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 02</p>
          <p>Location</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 03</p>
          <p>Location</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 04</p>
          <p>Codes</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 05</p>
          <p>Codes</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 06</p>
          <p>Codes</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 07</p>
          <p>Codes</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 08</p>
          <p>Codes</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 09</p>
          <p>Codes</p>
        </div>
        <div class="text-teal-700">
          <p class="font-bold">Quiz 10</p>
          <p>Codes</p>
        </div>
      </div>
    </div>
  </div>
</div>