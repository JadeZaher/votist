import type { LayoutServerLoad } from './$types';
import { buildClerkProps } from 'svelte-clerk/server';
import { clerkClient } from 'svelte-clerk/server';
import { prisma } from '$lib/server/db/prisma';

export const load = (async ({ locals }) => {
	const { userId } = await locals.auth();
	const clerkProps = buildClerkProps(locals.auth());

	let userData = null;
	if (userId) {
		const [clerkUser, dbUser] = await Promise.all([
			clerkClient.users.getUser(userId),
			prisma.user.findUnique({
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
					createdAt: true
				}
			})
		]);

		userData = {
			fullName:
				dbUser?.firstName && dbUser?.lastName
					? `${dbUser.firstName} ${dbUser.lastName}`
					: clerkUser.firstName && clerkUser.lastName
						? `${clerkUser.firstName} ${clerkUser.lastName}`
						: clerkUser.username || 'Anonymous',
			avatarUrl: dbUser?.avatarUrl || clerkUser.imageUrl || null,
			email: dbUser?.email || clerkUser.emailAddresses[0]?.emailAddress || null,
			firstName: dbUser?.firstName || clerkUser.firstName || null,
			lastName: dbUser?.lastName || clerkUser.lastName || null,
			role: dbUser?.role || (clerkUser.publicMetadata?.role as string) || 'visitor',
			isAdmin: dbUser?.isAdmin ?? false,
			isResident: dbUser?.isResident ?? false,
			dbUserId: dbUser?.id || null,
			createdAt: dbUser?.createdAt?.toISOString() || null
		};
	}

	return {
		clerk: clerkProps,
		user: userData
	};
}) satisfies LayoutServerLoad;
