import { getUser } from '$lib/server/auth';
import type { ServerLoad } from '@sveltejs/kit';

export const load = (async (event) => {
	return getUser(event);
}) satisfies ServerLoad;
