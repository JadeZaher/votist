<script lang="ts">
	import { ChevronLeft, ChevronRight, MessageCircle, Share2, BookOpen } from 'lucide-svelte';
	import logo from '$lib/assets/logo/votist-logo.png';
	import san_rafael from '$lib/proposals/san-rafael.png';
	import housing1 from '$lib/proposals/housing1.png';
	import { toImageUrl } from '../../util/image';
	import HeroCard from '$lib/components/HeroCard.svelte';
	import VotingProgressBar from '$lib/components/VotingProgressBar.svelte';

	const proposals = [
		{
			id: 1,
			title: '1230 Fifth Avenue',
			description: 'Multi-family housing',
			details: ['12 Stories', '139 feet', '187 residential units', '157 parking spaces'],
			image: housing1,
			votes: {
				yes: 15,
				neutral: 3,
				no: 13
			}
		},
		{
			id: 2,
			title: 'Invisible Overpass',
			description: 'Conceals HWY 101 overpass with advanced solar powered led panels.',
			details: ['12 Stories', '139 feet', '187 residential units', '157 parking spaces'],
			image: housing1,
			votes: {
				yes: 15,
				neutral: 3,
				no: 13
			}
		}
	];

	const votingResults = {
		'Yes, Build it!': 12,
		'Needs changes.': 5,
		'No thanks.': 3
	};

	const chatQuestions = [
		'What is votist?',
		'Who is the developer of 1230 Fifth Avenue?',
		'What do the State Mandates require?',
		'What is the current population of San Rafael?'
	];
</script>

<div class="bg-base-100 min-h-screen">
	<!-- Hero Section -->
	<HeroCard />

	<!-- Proposals Grid -->
	<div class="container mx-auto px-4 py-8">
		<div class="grid gap-6 md:grid-cols-2">
			{#each proposals as proposal}
				<div class="card bg-base-100 shadow-xl">
					<figure>
						<img
							src={proposal.image || '/placeholder.svg'}
							alt={proposal.title}
							class="h-48 w-full object-cover"
						/>
					</figure>
					<div class="card-body">
						<h3 class="card-title">{proposal.title}</h3>
						<p>{proposal.description}</p>
						<div class="mt-4 flex justify-between">
							<div class="w-full">
								<VotingProgressBar
									yesVotes={proposal.votes.yes}
									noVotes={proposal.votes.no}
									neutralVotes={proposal.votes.neutral}
								/>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Main Proposal Details -->
		<div class="mt-8 grid gap-8 md:grid-cols-2">
			<div class="relative">
				<div class="carousel w-full">
					<img
						src={proposals[0].image || '/placeholder.svg'}
						alt="Building view"
						class="w-full rounded-lg"
					/>
				</div>
				<button class="btn btn-circle absolute top-1/2 left-2 -translate-y-1/2">
					<ChevronLeft />
				</button>
				<button class="btn btn-circle absolute top-1/2 right-2 -translate-y-1/2">
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
					<div class="mb-4 flex items-center gap-2">
						<svg class="text-primary h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
							<path d="M18 13v5H2v-5h16zm-7-5l5 5H4l5-5V3h2v5z" />
						</svg>
						<span class="font-bold">Vote</span>
					</div>

					{#each Object.entries(votingResults) as [option, count]}
						<div class="mb-2 flex items-center gap-2">
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
		<div class="mt-8 flex gap-4 border-t border-b py-4">
			<button class="btn btn-ghost gap-2">
				<BookOpen class="h-5 w-5" />
				Research
				<span class="badge badge-sm">24</span>
			</button>
			<button class="btn btn-primary gap-2">
				<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
					<path d="M18 13v5H2v-5h16zm-7-5l5 5H4l5-5V3h2v5z" />
				</svg>
				Vote
			</button>
			<button class="btn btn-ghost">
				<Share2 class="h-5 w-5" />
			</button>
		</div>

		<!-- Research Section -->
		<div class="mt-8 grid gap-8 md:grid-cols-2">
			<div>
				<h2 class="mb-4 text-2xl font-bold">Research</h2>
				<h3 class="mb-2 text-xl font-semibold">What is this?</h3>
				<p class="mb-4">
					The 1230 Fifth Avenue project is a proposed multi-family housing development in San Rafael
					featuring 187 residential units, including affordable housing, with requests for zoning
					waivers to accommodate its design.
				</p>
				<p class="mb-4">
					This Votist poll is a chance for informed community to share opinions on how San Rafael
					balances housing needs, zoning regulations, and growth. It's not an official vote, but a
					way to gauge public sentiment through informed discussion.
				</p>

				<h3 class="mt-6 mb-2 text-xl font-semibold">Data and Resources</h3>
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
					<p class="text-base-content/70 text-sm">
						The Votist team has provided documents and key information related to this project. I
						also have the quiz questions and answers available.
					</p>
					<div class="mt-4 space-y-2">
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
									<MessageCircle class="h-5 w-5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
