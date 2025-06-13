import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const { userId } = await locals.auth();

	return json({
		isAuthenticated: !!userId
	});
};
