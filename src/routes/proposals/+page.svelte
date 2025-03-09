<script lang="ts">
    import { ChevronLeft, ChevronRight, MessageCircle, Share2, BookOpen } from 'lucide-svelte';
    import logo from '$lib/assets/logo/votist-logo.png'
    import san_rafael from '$lib/proposals/san-rafael.png'
    import housing1 from '$lib/proposals/housing1.png'
    import { toImageUrl } from '../../util/image';
    
    const proposals = [
      {
        id: 1,
        title: "1230 Fifth Avenue",
        description: "Multi-family housing",
        details: [
          "12 Stories",
          "139 feet",
          "187 residential units",
          "157 parking spaces"
        ],
        image: housing1,
        votes: {
          yes: 15,
          neutral: 3,
          no: 13
        }
      },
      {
        id: 2,
        title: "Invisible Overpass",
        description: "Conceals HWY 101 overpass with advanced solar powered led panels.",
        details: [
          "12 Stories",
          "139 feet",
          "187 residential units",
          "157 parking spaces"
        ],
        image: housing1,
        votes: {
          yes: 15,
          neutral: 3,
          no: 13
        }
      }
    ];
  
    const votingResults = {
      "Yes, Build it!": 12,
      "Needs changes.": 5,
      "No thanks.": 3
    };
  
    const chatQuestions = [
      "What is votist?",
      "Who is the developer of 1230 Fifth Avenue?",
      "What do the State Mandates require?",
      "What is the current population of San Rafael?"
    ];
  </script>
  
  <div class="min-h-screen bg-base-100">
    <!-- Header -->
 
  
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-6xl font-bold text-primary z-10 text-left">San Rafael California</h1>
        <div class="relative h-[400px] bg-[#2B7B9B] text-white overflow-clip gradient-bg" style="--bg: {toImageUrl(san_rafael)}">
          
          <div class='m-4'>

            <h2 class="text-3xl font-semibold mb-4">Growth, Housing, and the Future We Decide</h2>
            <p class="max-w-3xl">
              San Rafael is growing, but housing isn’t keeping up. With the world’s population expected to surpass 9 billion by 2040 
              and 11 billion by 2100, urban centers everywhere are struggling to expand while preserving their identity, resources, 
              and livability. 
              <br><br/>
              How should San Rafael grow to meet the future? 
            </p>
          </div>
      </div>
    </div>
  
    <!-- Proposals Grid -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid md:grid-cols-2 gap-6">
        {#each proposals as proposal}
          <div class="card bg-base-100 shadow-xl">
            <figure>
              <img src={proposal.image || "/placeholder.svg"} alt={proposal.title} class="w-full h-48 object-cover" />
            </figure>
            <div class="card-body">
              <h3 class="card-title">{proposal.title}</h3>
              <p>{proposal.description}</p>
              <div class="flex justify-between mt-4">
                <div class="stats">
                  <div class="stat-value text-success">{proposal.votes.yes}</div>
                  <div class="stat-value text-warning">{proposal.votes.neutral}</div>
                  <div class="stat-value text-error">{proposal.votes.no}</div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
  
      <!-- Main Proposal Details -->
      <div class="mt-8 grid md:grid-cols-2 gap-8">
        <div class="relative">
          <div class="carousel w-full">
            <img src={proposals[0].image || "/placeholder.svg"} alt="Building view" class="w-full rounded-lg" />
          </div>
          <button class="btn btn-circle absolute left-2 top-1/2 -translate-y-1/2">
            <ChevronLeft />
          </button>
          <button class="btn btn-circle absolute right-2 top-1/2 -translate-y-1/2">
            <ChevronRight />
          </button>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold">1230 Fifth Avenue</h2>
          <h3 class="text-xl">San Rafael, CA</h3>
          <ul class="mt-4 space-y-2">
            {#each proposals[0].details as detail}
              <li>{detail}</li>
            {/each}
          </ul>
  
          <!-- Voting Results -->
          <div class="mt-8">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 13v5H2v-5h16zm-7-5l5 5H4l5-5V3h2v5z"/>
              </svg>
              <span class="font-bold">Vote</span>
            </div>
            
            {#each Object.entries(votingResults) as [option, count]}
              <div class="flex items-center gap-2 mb-2">
                <progress
                  class="progress progress-primary w-56"
                  value={count}
                  max={Object.values(votingResults).reduce((a, b) => a + b, 0)}
                ></progress>
                <span>{option}</span>
                <span class="ml-auto">{count}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
  
      <!-- Action Bar -->
      <div class="flex gap-4 py-4 border-t border-b mt-8">
        <button class="btn btn-ghost gap-2">
          <BookOpen class="w-5 h-5" />
          Research
          <span class="badge badge-sm">24</span>
        </button>
        <button class="btn btn-primary gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 13v5H2v-5h16zm-7-5l5 5H4l5-5V3h2v5z"/>
          </svg>
          Vote
        </button>
        <button class="btn btn-ghost">
          <Share2 class="w-5 h-5" />
        </button>
      </div>
  
      <!-- Research Section -->
      <div class="grid md:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 class="text-2xl font-bold mb-4">Research</h2>
          <h3 class="text-xl font-semibold mb-2">What is this?</h3>
          <p class="mb-4">
            The 1230 Fifth Avenue project is a proposed multi-family housing development in San Rafael 
            featuring 187 residential units, including affordable housing, with requests for zoning waivers to 
            accommodate its design.
          </p>
          <p class="mb-4">
            This Votist poll is a chance for informed community to share opinions on how San Rafael 
            balances housing needs, zoning regulations, and growth. It's not an official vote, but a way to gauge 
            public sentiment through informed discussion.
          </p>
  
          <h3 class="text-xl font-semibold mt-6 mb-2">Data and Resources</h3>
          <div class="space-y-4">
            <div>
              <h4 class="font-semibold">From the Developer:</h4>
              <p>Nov 27, 2024 Proposals</p>
            </div>
            <div>
              <h4 class="font-semibold">San Rafael City Website:</h4>
              <ul class="link-list">
                <li><a href="/" class="link">Link to San Rafael City Webpage</a></li>
                <li><a href="/" class="link">General Plan</a></li>
                <li><a href="/" class="link">Precise Plan</a></li>
              </ul>
            </div>
          </div>
        </div>
  
        <!-- Chatbot -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center gap-2">
              <h3 class="card-title">San Rafael Chatbot</h3>
              <span class="badge badge-primary">Votist AI Agent</span>
            </div>
            <p class="text-sm text-base-content/70">
              The Votist team has provided documents and key information related to this project. 
              I also have the quiz questions and answers available.
            </p>
            <div class="space-y-2 mt-4">
              {#each chatQuestions as question}
                <button class="btn btn-outline btn-sm w-full justify-start">
                  {question}
                </button>
              {/each}
            </div>
            <div class="mt-4">
              <div class="form-control">
                <div class="input-group">
                  <input
                    type="text"
                    placeholder="Message the San Rafael Chatbot"
                    class="input input-bordered w-full"
                  />
                  <button class="btn btn-square btn-primary">
                    <MessageCircle class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <style lang="post-css">
    .gradient-bg {
      background-image: var(--bg);
      opacity: 0.94;
      @apply bg-[100%];
    }
</style>