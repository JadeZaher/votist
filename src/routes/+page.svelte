<script lang="ts">
	import earnVote from '$lib/assets/icons/earn-voting-power.png';
	import logo from '$lib/assets/logo/logo-header.png';
	import HeroSection from '$lib/components/cards/HeroSection.svelte';
	import CenterContentCTA from '$lib/components/cards/CenterContentCTA.svelte';
	import ImageTextSection from '$lib/components/cards/ImageTextSection.svelte';
	import QuizFeatureCard from '$lib/components/cards/QuizFeatureCard.svelte';
	import knowledgeispower from '$lib/assets/home/knowledge-is-power.png';
	import sanRafael from '$lib/assets/home/san-raph-hero.png';
</script>

<HeroSection />

<CenterContentCTA
	heading="Help Shape the Future of San Rafael"
	boldcontent="Here, the more you know, the more impact you have."
	content=" Votist is a platform for solution-driven civic engagement—where informed participation creates increased influence. The result? Smarter debates, better decisions, and a stronger community."
	subContent="Ready to shape San Rafael's future? Let's get started."
	primaryButton={{ text: 'Start', href: '/quiz' }}
	secondaryButton={{ text: 'Earn Voting Power', href: '/learn-more', icon: earnVote }}
/>

<ImageTextSection
	heading="On Votist, knowledge is power — your power."
	content="Our Votist Levels ensure that every discussion is led by informed voices, not just the loudest ones. By completing these quizzes, you're not just proving what you know; you're securing your place in a community where credibility is earned."
	imageUrl={knowledgeispower}
	imageAlt="Quiz interface showing progress"
	buttonText="Start"
	buttonHref="/quiz"
	imageOnLeft={false}
/>

<ImageTextSection
	heading="On Votist, knowledge is power — your power."
	content="Votist is a civic discussion platform where participation is earned through demonstrated understanding, not volume or outrage. The goal is to surface well-articulated visions and arguments by slowing people down and privileging knowledge over reaction."
	imageUrl={knowledgeispower}
	imageAlt="Voting interface showing options"
	buttonText="Start"
	buttonHref="/quiz"
	imageOnLeft={true}
/>

<QuizFeatureCard
	title="Knowledge is Power"
	level="Level 01"
	location="San Rafael, Location"
	buttonText="Start"
	buttonHref="/quiz"
	backgroundImage={sanRafael}
/>

<style></style>
