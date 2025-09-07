import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

export const load = (async (event) => {
	try {
		const { user, isAuthenticated } = await getUser(event);

		if (!isAuthenticated || !user) {
			throw redirect(307, '/sign-in');
		}

		if (user.publicMetadata?.role !== 'admin') {
			throw redirect(307, '/');
		}

		return { user };
	} catch (error) {
		console.error('Admin layout load error:', error);
		// For now, redirect to sign-in if there's any error
		throw redirect(307, '/sign-in');
	}
}) satisfies ServerLoad;
