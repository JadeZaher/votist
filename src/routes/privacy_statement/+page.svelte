<script lang="ts">
	const supportMenuItems = [
		{ title: 'What is Votist?', href: '#what-is-votist' },
		{ title: 'Proof of Concept Disclaimer', href: '#proof-of-concept' },
		{ title: 'Terms of Service', href: '#terms-of-service' },
		{ title: 'Privacy', href: '#privacy' },
		{ title: 'Contact', href: '#contact' }
	];

	let activeSection = $state('privacy');

	function scrollToSection(sectionId: string) {
		activeSection = sectionId;
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Privacy-statement</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-12">
			<div class="lg:col-span-1">
				<div class="sticky top-8">
					<h1 class="mb-6 text-2xl font-bold text-gray-900 sm:mb-8 sm:text-3xl">Support</h1>

					<nav class="space-y-2">
						{#each supportMenuItems as item}
							<button
								class="block w-full py-1 text-left font-bold text-teal-700 transition-colors hover:text-teal-800 hover:underline"
								onclick={() => scrollToSection(item.href.substring(1))}
							>
								{item.title}
							</button>
						{/each}
					</nav>
				</div>
			</div>

			<!-- Main Content -->
			<div class="lg:col-span-3">
				<div class="prose prose-lg max-w-none">
					<section id="privacy" class="mb-12">
						<h2 class="mb-6 text-2xl font-bold text-teal-700 sm:text-3xl">
							Votist Privacy Statement
						</h2>

						<h3 class="mb-4 text-xl font-bold text-gray-900">
							Your Data is Not Our Business—Your Voice Is.
						</h3>

						<p class="mb-6 leading-relaxed text-gray-700">
							At Votist, we believe in informed civic engagement, <strong>NOT</strong> data monetization.
							Protecting your privacy is fundamental to our mission, and we are committed to ensuring
							that your personal information remains secure and under your control.
						</p>

						<h4 class="mb-4 text-lg font-bold text-gray-900">Votist Commitments to You</h4>

						<div class="space-y-8">
							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">
									1. No Sale or Sharing of Personal Data
								</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>We do not sell, rent, or share your personal information with third parties
											for profit.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>Advertisers and sponsors, if present, never receive access to your personal
											data.</span
										>
									</li>
								</ul>
							</div>

							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">
									2. Anonymized Public Data & User Recognition
								</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>Any data used for public insights, trends, or discussions is fully stripped
											of personal identifiers before being shared.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>By default your individual votes, quiz answers, and participation history are
											never publicly linked to your identity.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>However, your credibility status, expertise level, and number of completed
											knowledge tests may be visible to reflect your contributions to the community.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>If you choose to share your identity in discussions, that is your choice—but
											Votist does not display your voting choices, quiz answers, or specific
											activity history unless you choose to do so.</span
										>
									</li>
								</ul>
							</div>

							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">
									3. User Control & Transparency
								</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span>You decide what information is visible on your profile.</span>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>Privacy settings empower you to manage your data, and we minimize required
											information for account creation.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>Your participation (votes, quizzes, discussions) is stored only as necessary
											for credibility scoring and engagement tracking, but never shared externally
											in an identifiable way.</span
										>
									</li>
								</ul>
							</div>

							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">
									4. Data Retention & Anonymization
								</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span>Where possible, we keep no personal data at all.</span>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>When data must be stored (e.g., for credibility scoring), we use encryption
											and anonymization to separate your identity from your activity.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>If you delete your account, your personal data is removed from our active
											systems.</span
										>
									</li>
								</ul>
							</div>

							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">5. Security & Best Efforts</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>We use industry-standard encryption and security protocols to protect user
											data.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>However, no system is completely secure. While we take strong precautions, we
											cannot guarantee absolute protection against unauthorized access, data
											breaches, or unforeseen vulnerabilities.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>By using Votist, you acknowledge these risks, and we commit to full
											transparency in the event of any security issue.</span
										>
									</li>
								</ul>
							</div>

							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">6. No Tracking for Profit</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>We do not engage in behavioral tracking for profit-driven personalization.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>Any analytics we use are strictly for platform improvement, not advertising
											targeting.</span
										>
									</li>
								</ul>
							</div>

							<div>
								<h5 class="mb-3 text-base font-bold text-gray-900">
									7. Ethical Advertising & Sponsorships (If Applicable)
								</h5>
								<ul class="ml-4 space-y-2 text-gray-700">
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>If Votist includes advertising, it will be aligned with our mission—not
											invasive tracking-based ads.</span
										>
									</li>
									<li class="flex items-start">
										<span class="mr-2 text-gray-400">•</span>
										<span
											>Sponsors and advertisers will have zero access to personal user data and will
											only engage with general, non-identifiable audience insights (e.g., "X% of
											users are interested in civic policy").</span
										>
									</li>
								</ul>
							</div>
						</div>

						<div class="mt-8 rounded-lg bg-blue-50 p-6">
							<h4 class="mb-3 text-lg font-bold text-gray-900">Trust is Our Foundation</h4>
							<p class="leading-relaxed text-gray-700">
								Votist is designed to elevate informed civic engagement—not to extract value from
								its users. Our approach to data prioritizes anonymity, security, and respect,
								because a platform built on trust must earn that trust every day.
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
</div>
