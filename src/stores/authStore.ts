import { writable } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';

interface AuthState {
	isAuthenticated: boolean;
	isLoading: boolean;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<AuthState>({
		isAuthenticated: false,
		isLoading: true
	});

	return {
		subscribe,
		setAuthenticated: (authenticated: boolean) => {
			update((state) => ({
				...state,
				isAuthenticated: authenticated,
				isLoading: false
			}));
		},
		setLoading: (loading: boolean) => {
			update((state) => ({ ...state, isLoading: loading }));
		},
		signOut: () => {
			set({ isAuthenticated: false, isLoading: false });
			goto('/sign-in');
		}
	};
}

export const authStore = createAuthStore();

// Helper function to check if user should be redirected
export function shouldRedirectToSignIn(pathname: string): boolean {
	const protectedRoutes = ['/dashboard', '/admin'];
	return protectedRoutes.some((route) => pathname.startsWith(route));
}

// Helper function to check if authenticated user should be redirected to dashboard
export function shouldRedirectToDashboard(pathname: string): boolean {
	const publicRoutes = [
		'/',
		'/sign-in',
		'/sign-up',
		'/sign-out',
		'/contact',
		'/learn-more',
		'/proposals',
		'/quiz'
	];
	return publicRoutes.includes(pathname);
}
