import type { PageServerLoad } from './$types';
import { getUser } from '$lib/server/auth';
import { prisma } from '$lib/server/db/prisma';

export const load = (async (event) => {
	const { user, isAuthenticated } = await getUser(event);

	if (!isAuthenticated || !user) {
		throw new Error('Unauthorized');
	}

	if (user.publicMetadata?.role !== 'admin') {
		throw new Error('Admin access required');
	}

	const post = await prisma.post.findUnique({
		where: { id: event.params.id },
		include: {
			poll: {
				include: {
					options: true
				}
			},
			quizGateQuiz: {
				select: {
					id: true,
					title: true,
					difficulty: true
				}
			}
		}
	});

	if (!post) {
		throw new Error('Post not found');
	}

	return {
		post
	};
}) satisfies PageServerLoad;
