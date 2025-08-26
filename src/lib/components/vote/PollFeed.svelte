<script lang="ts">
	import type { PollFeedData } from '$lib/types';
	import DiscussionForum from './DiscussionForum.svelte';

	// Mock data for multiple polls
	const mockPolls: PollFeedData[] = [
		{
			post: {
				id: '1',
				title: 'Which React 19 feature are you most excited about?',
				content:
					"React 19 has introduced several groundbreaking features that are changing how we build applications. I'm curious to see which feature the community is most excited about!\n\nEach of these features brings significant improvements to developer experience and application performance. Cast your vote and let's see what the community thinks!",
				author: {
					name: 'Sarah Chen',
					avatar:
						'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
					username: 'sarahdev',
					isVerified: true
				},
				timestamp: '2 hours ago',
				category: 'React',
				likes: 42,
				comments: 18,
				isLiked: false,
				isBookmarked: true,
				tags: ['react', 'javascript', 'frontend', 'poll'],
				poll: {
					question: 'Which React 19 feature are you most excited about?',
					options: [
						{ id: 'option1', text: 'Server Components integration', votes: 156 },
						{ id: 'option2', text: 'New use() hook', votes: 89 },
						{ id: 'option3', text: 'Automatic batching improvements', votes: 134 },
						{ id: 'option4', text: 'Suspense enhancements', votes: 67 },
						{ id: 'option5', text: 'Compiler optimizations', votes: 198 }
					],
					totalVotes: 644,
					endsAt: 'in 3 days'
				}
			},
			comments: [
				{
					id: 'c1',
					author: {
						name: 'Alex Rodriguez',
						avatar:
							'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
						username: 'alexr'
					},
					content:
						'Voted for Server Components! The automatic deduplication of requests has been a game-changer in my projects.',
					timestamp: '1 hour ago',
					likes: 12,
					isLiked: true,
					replies: [
						{
							id: 'c1r1',
							author: {
								name: 'Maya Patel',
								avatar:
									'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
								username: 'mayap'
							},
							content: 'Same here! Have you noticed any differences in bundle size?',
							timestamp: '45 min ago',
							likes: 3,
							isLiked: false
						}
					]
				},
				{
					id: 'c2',
					author: {
						name: 'David Kim',
						avatar:
							'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
						username: 'davidk'
					},
					content:
						'I went with compiler optimizations. The automatic performance improvements without changing code is amazing!',
					timestamp: '45 min ago',
					likes: 7,
					isLiked: false
				}
			]
		},
		{
			post: {
				id: '2',
				title: "What's your preferred CSS framework in 2024?",
				content:
					"With so many CSS frameworks and approaches available today, I'm curious about what the community is gravitating towards. Each option has its own strengths and use cases.\n\nWhat has your experience been like with these different approaches?",
				author: {
					name: 'Marcus Johnson',
					avatar:
						'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
					username: 'marcusj',
					isVerified: false
				},
				timestamp: '4 hours ago',
				category: 'CSS',
				likes: 28,
				comments: 12,
				isLiked: false,
				isBookmarked: false,
				tags: ['css', 'tailwind', 'styling', 'frontend'],
				poll: {
					question: "What's your preferred CSS framework in 2024?",
					options: [
						{ id: 'css1', text: 'Tailwind CSS', votes: 245 },
						{ id: 'css2', text: 'CSS Modules', votes: 89 },
						{ id: 'css3', text: 'Styled Components', votes: 76 },
						{ id: 'css4', text: 'Vanilla CSS', votes: 134 },
						{ id: 'css5', text: 'Emotion', votes: 45 }
					],
					totalVotes: 589,
					endsAt: 'in 5 days'
				}
			},
			comments: [
				{
					id: 'c3',
					author: {
						name: 'Elena Vasquez',
						avatar:
							'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
						username: 'elenav'
					},
					content:
						'Tailwind all the way! The developer experience and consistency it provides is unmatched.',
					timestamp: '3 hours ago',
					likes: 8,
					isLiked: false
				},
				{
					id: 'c4',
					author: {
						name: "Ryan O'Connor",
						avatar:
							'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
						username: 'ryano'
					},
					content:
						"I still prefer vanilla CSS for better understanding of what's happening under the hood.",
					timestamp: '2 hours ago',
					likes: 15,
					isLiked: true
				}
			]
		},
		{
			post: {
				id: '3',
				title: 'Which deployment platform do you use most often?',
				content:
					"Deployment platforms have evolved significantly, each offering unique features and pricing models. I'm interested in seeing what the community prefers for different types of projects.\n\nShare your experiences and any tips for fellow developers!",
				author: {
					name: 'Ashley Kim',
					avatar:
						'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
					username: 'ashleyk',
					isVerified: true
				},
				timestamp: '6 hours ago',
				category: 'DevOps',
				likes: 67,
				comments: 24,
				isLiked: true,
				isBookmarked: true,
				tags: ['deployment', 'hosting', 'devops', 'infrastructure'],
				poll: {
					question: 'Which deployment platform do you use most often?',
					options: [
						{ id: 'deploy1', text: 'Vercel', votes: 189 },
						{ id: 'deploy2', text: 'Netlify', votes: 156 },
						{ id: 'deploy3', text: 'AWS', votes: 234 },
						{ id: 'deploy4', text: 'Railway', votes: 78 },
						{ id: 'deploy5', text: 'DigitalOcean', votes: 123 }
					],
					totalVotes: 780,
					endsAt: 'in 2 days'
				}
			},
			comments: [
				{
					id: 'c5',
					author: {
						name: 'James Wilson',
						avatar:
							'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
						username: 'jamesw'
					},
					content:
						"Vercel's integration with Next.js is seamless. The deployment experience is fantastic!",
					timestamp: '5 hours ago',
					likes: 19,
					isLiked: false,
					replies: [
						{
							id: 'c5r1',
							author: {
								name: 'Sofia Martinez',
								avatar:
									'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
								username: 'sofiam'
							},
							content: 'Agreed! The preview deployments for every PR are a game changer.',
							timestamp: '4 hours ago',
							likes: 12,
							isLiked: true
						}
					]
				},
				{
					id: 'c6',
					author: {
						name: 'Tom Zhang',
						avatar:
							'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
						username: 'tomz'
					},
					content:
						'AWS is more complex but gives you complete control over your infrastructure. Worth learning!',
					timestamp: '4 hours ago',
					likes: 22,
					isLiked: false
				}
			]
		}
	];
</script>

<div class="mx-auto max-w-4xl space-y-6 p-4">
	<div class="mb-8">
		<h1 class="mb-2 text-3xl font-bold">Community Polls</h1>
		<p class="text-muted-foreground text-gray-600">
			Engage with the developer community by voting on polls and joining discussions
		</p>
	</div>

	{#each mockPolls as pollData (pollData.post.id)}
		<DiscussionForum {pollData} />
	{/each}
</div>
