<script lang="ts">
  import { resetQuiz, goToPage } from "../../../stores/quizStore";
  import coffeSVG from "$lib/assets/Coffee.svg";

  function handleTryAgain() {
    resetQuiz();
    goToPage("start");
  }
</script>

<div
  class="bg-white rounded-lg shadow-md p-12 justify-center w-2/3 align-middle text-center mx-auto"
>
  <div class="text-center py-8">
    <div class="mb-4 flex justify-center items-center">
      <img src={coffeSVG} alt="coffee" />
      <div class=" text-left ml-8">
        <h3 class="text-4xl font-medium text-gray-600">Good effort</h3>
        <p class="text-teal-600 text-3xl font-bold">
          Learn more about this topic in the Research Tab
        </p>
      </div>
    </div>

    <div class="text-left mx-48 ">
      <h2 class="text-5xl font-bold text-teal-700 my-8">Try again!</h2>

      <button
        class="text-2xl font-bold px-6 py-2 bg-teal-600 text-white rounded-md  shadow-[3px_4px_4px_0px_rgba(0,0,0,0.25)]  hover:bg-teal-900 transition duration-150"
        on:click={handleTryAgain}
      >
        Start
      </button>
      <span class="ml-4 text-2xl text-teal-700">San Rafael, Location</span>
    </div>
  </div>
</div>
