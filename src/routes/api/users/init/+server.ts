import { error, json } from '@sveltejs/kit';
import { clerkClient } from 'svelte-clerk/server';
import { prisma } from '$lib/server/db/prisma';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals }) => {
	const { userId } = await locals.auth();

	if (!userId) {
		return json({ success: false, message: 'No authentication' });
	}

	try {
		const clerkUser = await clerkClient.users.getUser(userId);

		if (!clerkUser) {
			throw error(404, 'User not found in Clerk');
		}

		const userData = {
			clerkId: userId,
			email: clerkUser.emailAddresses[0]?.emailAddress,
			isAdmin: clerkUser.publicMetadata?.role === 'admin'
		};

		const existingUser = await prisma.user.findUnique({
			where: { clerkId: userId }
		});

		if (!existingUser) {
			const newUser = await prisma.user.create({
				data: userData
			});

			return json({
				success: true,
				created: true,
				user: newUser
			});
		}

		const updatedUser = await prisma.user.update({
			where: { clerkId: userId },
			data: userData
		});

		return json({
			success: true,
			created: false,
			user: updatedUser
		});
	} catch (err) {
		console.error('Error initializing user:', err);
		throw error(500, 'Failed to initialize user');
	}
};
