import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';
import { getUser } from '$lib/server/auth';

export const load = (async (event) => {
	const { user } = await getUser(event);

	if (user.publicMetadata?.role !== 'admin') {
		throw redirect(307, '/');
	}

	return { user };
}) satisfies ServerLoad;
