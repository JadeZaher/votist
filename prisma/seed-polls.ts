import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Create sample users if they don't exist
	const user1 = await prisma.user.upsert({
		where: { clerkId: 'user_2abc123def456' },
		update: {},
		create: {
			clerkId: 'user_2abc123def456',
			email: 'marcus.johnson@example.com'
		}
	});

	const user2 = await prisma.user.upsert({
		where: { clerkId: 'user_2def456ghi789' },
		update: {},
		create: {
			clerkId: 'user_2def456ghi789',
			email: 'elena.vasquez@example.com'
		}
	});

	const user3 = await prisma.user.upsert({
		where: { clerkId: 'user_2ghi789jkl012' },
		update: {},
		create: {
			clerkId: 'user_2ghi789jkl012',
			email: 'ryan.oconnor@example.com'
		}
	});

	// Create sample posts with polls
	const post1 = await prisma.post.create({
		data: {
			title: "What's your preferred CSS framework in 2024?",
			content:
				"With so many CSS frameworks and approaches available today, I'm curious about what the community is gravitating towards. Each option has its own strengths and use cases.\n\nWhat has your experience been like with these different approaches?",
			authorId: user1.clerkId,
			category: 'CSS',
			tags: ['css', 'tailwind', 'styling', 'frontend'],
			poll: {
				create: {
					question: "What's your preferred CSS framework in 2024?",
					endsAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
					options: {
						create: [
							{ text: 'Tailwind CSS', votes: 245 },
							{ text: 'CSS Modules', votes: 89 },
							{ text: 'Styled Components', votes: 76 },
							{ text: 'Vanilla CSS', votes: 134 },
							{ text: 'Emotion', votes: 45 }
						]
					}
				}
			}
		}
	});

	const post2 = await prisma.post.create({
		data: {
			title: 'Which JavaScript framework do you prefer for new projects?',
			content:
				"The JavaScript ecosystem is constantly evolving with new frameworks emerging regularly. I'd love to hear about your current preferences and reasoning behind your choices.",
			authorId: user2.clerkId,
			category: 'JavaScript',
			tags: ['javascript', 'react', 'vue', 'svelte', 'angular'],
			poll: {
				create: {
					question: 'Which JavaScript framework do you prefer for new projects?',
					endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
					options: {
						create: [
							{ text: 'React', votes: 320 },
							{ text: 'Vue.js', votes: 156 },
							{ text: 'Svelte', votes: 98 },
							{ text: 'Angular', votes: 87 },
							{ text: 'Next.js', votes: 234 }
						]
					}
				}
			}
		}
	});

	// Create sample comments
	await prisma.comment.create({
		data: {
			content:
				'Tailwind all the way! The developer experience and consistency it provides is unmatched.',
			authorId: user2.clerkId,
			postId: post1.id
		}
	});

	await prisma.comment.create({
		data: {
			content:
				"I still prefer vanilla CSS for better understanding of what's happening under the hood.",
			authorId: user3.clerkId,
			postId: post1.id
		}
	});

	await prisma.comment.create({
		data: {
			content:
				'React has the largest ecosystem and community support, which makes it my go-to choice.',
			authorId: user1.clerkId,
			postId: post2.id
		}
	});

	console.log('Seed data created successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
