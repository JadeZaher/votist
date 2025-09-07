import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
import { getUser } from '$lib/server/auth';

const prisma = new PrismaClient();

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
