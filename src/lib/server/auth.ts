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
			const email = clerkUser.emailAddresses[0]?.emailAddress;

			// Check for orphaned record with same email (Clerk account was deleted and recreated)
			const userByEmail = email
				? await prisma.user.findUnique({ where: { email } })
				: null;

			if (userByEmail) {
				// Re-link: update the orphaned record's clerkId to the new Clerk account
				await prisma.user.update({
					where: { id: userByEmail.id },
					data: {
						clerkId: userId,
						firstName: clerkUser.firstName ?? userByEmail.firstName,
						lastName: clerkUser.lastName ?? userByEmail.lastName,
						avatarUrl: clerkUser.imageUrl ?? userByEmail.avatarUrl,
						isAdmin: clerkUser.publicMetadata?.role === 'admin'
					}
				});
			} else {
				// Truly new user
				await prisma.user.create({
					data: {
						clerkId: userId,
						email,
						firstName: clerkUser.firstName,
						lastName: clerkUser.lastName,
						avatarUrl: clerkUser.imageUrl,
						isAdmin: clerkUser.publicMetadata?.role === 'admin'
					}
				});
			}
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
