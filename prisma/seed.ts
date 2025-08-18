import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	console.log('🌱 Starting database seed...');

	// Clear existing data
	await prisma.question.deleteMany();
	await prisma.quiz.deleteMany();
	await prisma.userProgress.deleteMany();
	await prisma.user.deleteMany();
	await prisma.assembly.deleteMany();

	console.log('🧹 Cleared existing data');

	// Create sample quizzes
	const quiz1 = await prisma.quiz.create({
		data: {
			title: 'San Rafael Housing Basics',
			description: 'Learn the fundamentals of housing policy in San Rafael',
			passingScore: 70,
			difficulty: 'VOTIST',
			order: 1,
			questions: {
				create: [
					{
						text: 'What is the primary goal of affordable housing policies?',
						type: 'multiple-choice',
						options: [
							'To increase property values',
							'To provide housing for low and moderate-income residents',
							'To reduce government spending',
							'To eliminate all rental properties'
						],
						correctAnswer: 'To provide housing for low and moderate-income residents'
					},
					{
						text: 'Which of the following is a common zoning restriction that affects housing development?',
						type: 'multiple-choice',
						options: [
							'Building height limits',
							'Parking requirements',
							'Density restrictions',
							'All of the above'
						],
						correctAnswer: 'All of the above'
					},
					{
						text: 'What does "inclusionary housing" mean?',
						type: 'multiple-choice',
						options: [
							'Housing that includes all amenities',
							'Policies requiring new developments to include affordable units',
							'Housing open to all income levels',
							'Government-owned housing only'
						],
						correctAnswer: 'Policies requiring new developments to include affordable units'
					}
				]
			}
		}
	});

	const quiz2 = await prisma.quiz.create({
		data: {
			title: 'Housing Development Process',
			description: 'Understanding how housing projects get approved and built',
			passingScore: 75,
			difficulty: 'SCHOLAR',
			order: 2,
			questions: {
				create: [
					{
						text: 'What is the first step in the housing development approval process?',
						type: 'multiple-choice',
						options: [
							'Construction begins',
							'Environmental impact assessment',
							'Pre-application meeting with planning department',
							'Public hearing'
						],
						correctAnswer: 'Pre-application meeting with planning department'
					},
					{
						text: "Which document outlines the long-term vision for a city's development?",
						type: 'multiple-choice',
						options: [
							'Building permit',
							'General Plan',
							'Environmental Impact Report',
							'Zoning ordinance'
						],
						correctAnswer: 'General Plan'
					},
					{
						text: 'What is CEQA?',
						type: 'multiple-choice',
						options: [
							'California Environmental Quality Act',
							'California Equal Quality Act',
							'Community Environmental Quality Assessment',
							'California Economic Quality Act'
						],
						correctAnswer: 'California Environmental Quality Act'
					}
				]
			}
		}
	});

	const quiz3 = await prisma.quiz.create({
		data: {
			title: 'Advanced Housing Policy',
			description: 'Deep dive into complex housing policy mechanisms',
			passingScore: 80,
			difficulty: 'MENTOR',
			order: 3,
			questions: {
				create: [
					{
						text: 'What is the Regional Housing Needs Allocation (RHNA)?',
						type: 'multiple-choice',
						options: [
							'A state mandate for cities to plan for housing at all income levels',
							'A federal housing subsidy program',
							'A local rent control ordinance',
							'A housing development financing mechanism'
						],
						correctAnswer: 'A state mandate for cities to plan for housing at all income levels'
					},
					{
						text: 'Which financing mechanism allows cities to capture increased property tax revenue from development?',
						type: 'multiple-choice',
						options: [
							'Tax increment financing',
							'Housing trust funds',
							'Impact fees',
							'Inclusionary housing fees'
						],
						correctAnswer: 'Tax increment financing'
					}
				]
			}
		}
	});

	// Create a sample assembly
	const assembly1 = await prisma.assembly.create({
		data: {
			title: 'San Rafael Housing Development Proposal',
			description: 'A proposal to build 200 affordable housing units in downtown San Rafael',
			status: 'active',
			topic: 'Housing',
			location: 'San Rafael, CA',
			votes: 0
		}
	});

	// Create a sample admin user
	const adminUser = await prisma.user.create({
		data: {
			clerkId: 'user_30QgpCvovAELPs2irLgoqeUVGEP',
			email: 'atoozmc@gmail.com',
			isAdmin: true
		}
	});

	// Create a sample admin user
	const adminUserJosh = await prisma.user.create({
		data: {
			clerkId: 'user_314lWa4CRUN5Jfs7UV37CQZKNs6',
			email: 'josh@votist.com',
			isAdmin: true
		}
	});

	console.log('✅ Database seeded successfully!');
	console.log(`Created ${3} quizzes with questions`);
	console.log(`Created ${1} assembly`);
	console.log(`Created ${1} admin user`);
}

main()
	.catch((e) => {
		console.error('❌ Error seeding database:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
