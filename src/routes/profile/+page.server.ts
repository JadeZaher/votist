import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/db/prisma';

export const load = (async ({ locals }) => {
	const { userId } = await locals.auth();
	if (!userId) {
		throw redirect(302, '/sign-in');
	}

	const dbUser = await prisma.user.findUnique({
		where: { clerkId: userId },
		select: {
			id: true,
			email: true,
			firstName: true,
			lastName: true,
			avatarUrl: true,
			role: true,
			isAdmin: true,
			isResident: true,
			createdAt: true,
			_count: {
				select: {
					posts: true,
					comments: true,
					votes: true
				}
			}
		}
	});

	if (!dbUser) {
		throw redirect(302, '/');
	}

	return {
		profile: {
			...dbUser,
			createdAt: dbUser.createdAt.toISOString()
		}
	};
}) satisfies PageServerLoad;
