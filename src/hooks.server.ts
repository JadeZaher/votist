import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
import { PRIVATE_CLERK_SECRET_KEY } from '$env/static/private';

export const handle: Handle = sequence(
	handleClerk(PRIVATE_CLERK_SECRET_KEY, {
		debug: true,
		protectedPaths: ['/proposals', '/quiz'], // Only protect specific paths, not the entire app
		signInUrl: '/sign-in'
	})
);
