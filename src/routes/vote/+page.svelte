<script lang="ts">
  import Vote from '$lib/components/vote/vote.svelte';

  const questions = [
    {
      id: 'housing-1',
      title: 'Should San Rafael Build More Housing?',
      description: 'Share your opinion on housing development in San Rafael',
      options: [
        {
          id: 1,
          text: 'Yes, San Rafael should build significantly more housing.',
          votes: 5
        },
        {
          id: 2,
          text: 'Yes, but only where housing fits the character and scale of the community.',
          votes: 12
        },
        {
          id: 3,
          text: 'No, San Rafael should focus on limiting housing growth. Fight State mandates!',
          votes: 8
        },
        {
          id: 4,
          text: 'Other Solutions. I have a different idea.',
          votes: 3
        }
      ]
    },
    {
      id: 'transit-1',
      title: 'How Should We Improve Public Transit?',
      description: 'Select your preferred approach to enhancing public transportation',
      options: [
        {
          id: 1,
          text: 'Increase bus frequency and routes',
          votes: 15
        },
        {
          id: 2,
          text: 'Expand SMART train service',
          votes: 22
        },
        {
          id: 3,
          text: 'Add more bike lanes',
          votes: 18
        },
        {
          id: 4,
          text: 'Improve pedestrian infrastructure',
          votes: 10
        }
      ]
    }
  ];
</script>

<h1 class="text-4xl font-bold text-secondary">Vote on Local Issues</h1>
<h2 class="text-2xl font-semibold text-base-content/80">
	Your opinion matters! Vote on the issues that matter most to you.
	Example Page
</h2>

<div class="flex flex-col gap-8">
  {#each questions as question}
    <Vote {question} userVotePower={1} />
  {/each}
</div>