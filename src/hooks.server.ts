import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleClerk } from 'clerk-sveltekit/server';
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const handle: Handle = sequence(
	handleClerk(publishableKey, {
		debug: true,
		protectedPaths: ['/proposals', '/quiz'], // Only protect specific paths, not the entire app
		signInUrl: '/sign-in'
	})
);
