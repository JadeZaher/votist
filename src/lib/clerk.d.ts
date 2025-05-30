// This file is now primarily for documentation
// Most types are now imported directly from @clerk/types

declare module '@clerk/types' {
	// Additional type extensions can be added here if needed
	export interface ClerkOptions {
		afterSignInUrl?: string;
		afterSignUpUrl?: string;
	}

	export interface SignUpCreateParams {
		emailAddress: string;
		password: string;
		firstName?: string;
		lastName?: string;
		phoneNumber?: string;
	}

	export interface SignInCreateParams {
		identifier?: string;
		password?: string;
		strategy?: 'email_link' | 'google' | 'github' | 'apple';
		redirectUrl?: string;
	}
}
