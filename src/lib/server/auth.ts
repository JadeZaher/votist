import { redirect } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';
import { prisma } from '$lib/server/db/prisma';
import type { RequestEvent } from '@sveltejs/kit';

export async function getUser(event: RequestEvent) {
	const { userId } = await event.locals.auth();

	if (!userId) {
		return {
			user: null,
			isAuthenticated: false
		};
	}

	try {
		const [clerkUser, existingUser] = await Promise.all([
			clerkClient.users.getUser(userId),
			prisma.user.findUnique({
				where: { clerkId: userId }
			})
		]);

		if (!existingUser) {
			await prisma.user.create({
				data: {
					clerkId: userId,
					email: clerkUser.emailAddresses[0]?.emailAddress,
					isAdmin: clerkUser.publicMetadata?.role === 'admin'
				}
			});
		}

		return {
			user: JSON.parse(JSON.stringify(clerkUser)),
			isAuthenticated: true
		};
	} catch (err) {
		console.error('Error loading user:', err);
		return {
			user: null,
			isAuthenticated: false
		};
	}
}

export async function requireAuth(event: RequestEvent) {
	const { userId } = await event.locals.auth();

	if (!userId) {
		throw redirect(307, '/sign-in');
	}

	return userId;
}
