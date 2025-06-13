import type { LayoutServerLoad } from './$types';
import { buildClerkProps } from 'svelte-clerk/server';
import { clerkClient } from 'svelte-clerk/server';

export const load = (async ({ locals }) => {
	const { userId } = await locals.auth();
	const clerkProps = buildClerkProps(locals.auth());

	let userData = null;
	if (userId) {
		const user = await clerkClient.users.getUser(userId);
		userData = {
			fullName:
				user.firstName && user.lastName
					? `${user.firstName} ${user.lastName}`
					: user.username || 'Anonymous',
			role: user.publicMetadata?.role || 'Visitor'
		};
	}

	return {
		clerk: clerkProps,
		user: userData
	};
}) satisfies LayoutServerLoad;
