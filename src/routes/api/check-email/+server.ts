import { createClerkClient } from '@clerk/backend';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY! });

export const GET: RequestHandler = async ({ url }) => {
	const email = url.searchParams.get('email');

	if (!email) {
		return new Response(JSON.stringify({ error: 'Email required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const { data: users } = await clerk.users.getUserList({ emailAddress: [email] });
		return new Response(JSON.stringify({ exists: users.length > 0 }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Error checking email' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
