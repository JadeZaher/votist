<script lang="ts">
  import { resetQuiz, goToPage } from "../../../stores/quizStore";
  import coffeeSVG from "$lib/assets/Coffee.svg";

  function handleTryAgain() {
    resetQuiz();
    goToPage("start");
  }
</script>

<div class="w-full h-[818px] relative bg-base-100">
  <div class="max-w-[1920px] mx-auto relative">
    <div class="absolute left-1/2 -translate-x-1/2 top-[171px]">
      <div class="flex items-start gap-8">
        <img 
          src={coffeeSVG} 
          alt="coffee" 
          class="w-28 h-32"
        />
        <div class="w-[890px]">
          <h3 class="text-base-content text-5xl font-medium mb-2">
            Good effort
          </h3>
          <p class="text-primary text-4xl font-medium">
            Learn more about this topic in the Research Tab
          </p>
        </div>
        <!-- TODO: Make this go to the Research tab when clicked -->
      </div>

      <div class="mt-20">
        <h2 class="text-primary text-6xl font-medium italic mb-8">
          Try again!
        </h2>

        <div class="flex items-center gap-8">
          <button
            class="btn btn-primary text-3xl font-medium min-w-[160px] h-14 shadow-[5px_2.5px_7.5px_0px_rgba(0,0,0,0.25)]"
            on:click={handleTryAgain}
          >
            Start
          </button>
          <span class="text-primary text-6xl font-medium">
            San Rafael, Location
          </span>
        </div>
      </div>
    </div>
  </div>
</div>