import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	const { userId } = await locals.auth();

	// Redirect unauthenticated users to sign-in
	if (!userId) {
		throw redirect(302, '/sign-in');
	}

	return {
		userId
	};
}) satisfies LayoutServerLoad;
