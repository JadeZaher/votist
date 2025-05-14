import type { HandleClientError } from '@sveltejs/kit';
import { initializeClerkClient } from 'clerk-sveltekit/client';
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

initializeClerkClient(publishableKey, {
	afterSignInUrl: '/admin/',
	afterSignUpUrl: '/admin/',
	signInUrl: '/sign-in',
	signUpUrl: '/sign-up'
});

export const handleError: HandleClientError = async ({ error, event }) => {
	console.error(error, event);
};
