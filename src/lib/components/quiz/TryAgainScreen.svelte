<script lang="ts">
  import { resetQuiz, goToPage } from "../../../stores/quizStore";
  import coffeeSVG from "$lib/assets/Coffee.svg";

  function handleTryAgain() {
    resetQuiz();
    goToPage("start");
  }
</script>

<div class="w-full min-h-screen bg-base-100">
  <div class="container mx-auto px-4">
    <div class="pt-8 md:pt-[171px]">
      <div class="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
        <img 
          src={coffeeSVG} 
          alt="coffee" 
          class="w-20 h-24 md:w-28 md:h-32"
        />
        <div class="w-full md:w-[890px] text-center md:text-left">
          <h3 class="text-base-content text-3xl md:text-5xl font-medium mb-2">
            Good effort
          </h3>
          <p class="text-primary text-2xl md:text-4xl font-medium">
            Learn more about this topic in the Research Tab
          </p>
        </div>
      </div>

      <div class="mt-12 md:mt-20 text-center md:text-left">
        <h2 class="text-primary text-4xl md:text-6xl font-medium italic mb-6 md:mb-8">
          Try again!
        </h2>

        <div class="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <button
            class="btn btn-primary text-xl md:text-3xl font-medium min-w-[160px] h-14 shadow-[5px_2.5px_7.5px_0px_rgba(0,0,0,0.25)]"
            on:click={handleTryAgain}
          >
            Start
          </button>
          <span class="text-primary text-3xl md:text-6xl font-medium">
            San Rafael, Location
          </span>
        </div>
      </div>
    </div>
  </div>
</div>