import * as ClerkImport from '@clerk/clerk-js';
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

// Clerk configuration
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

// Custom type to represent user information
interface ClerkUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber?: string;
}

// Transform Clerk's user object to our custom type
function transformUser(user: any): ClerkUser | null {
  if (!user) return null;

  return {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    emailAddress: user.primaryEmailAddress?.emailAddress || '',
    phoneNumber: user.primaryPhoneNumber?.phoneNumber
  };
}

// Auth stores with explicit types
export const user = writable<ClerkUser | null>(null);
export const isAuthenticated = writable<boolean>(false);
export const isLoading = writable<boolean>(true);

// Ensure Clerk is loaded
async function loadClerk(): Promise<void> {
  if (typeof window !== 'undefined' && !window.Clerk) {
    // Use dynamic import to get around construction issues
    const ClerkModule = await import('@clerk/clerk-js');
    // window.Clerk = new ClerkModule.default(PUBLISHABLE_KEY);
  }
}

// Initialize Clerk
export async function initClerk(): Promise<ClerkImport.Clerk> {
  await loadClerk();

  if (!window.Clerk) {
    throw new Error('Clerk failed to initialize');
  }

  try {
    await window.Clerk.load({
      afterSignInUrl: '/dashboard',
      afterSignUpUrl: '/dashboard'
    });

    // Set initial authentication state
    const currentUser = transformUser(window.Clerk.user);
    user.set(currentUser);
    isAuthenticated.set(!!currentUser);
    isLoading.set(false);

    // Set up listener for auth state changes
    window.Clerk.addListener((event) => {
      const transformedUser = transformUser(event.user);
      user.set(transformedUser);
      isAuthenticated.set(!!transformedUser);
      isLoading.set(false);
    });

    return window.Clerk;
  } catch (error) {
    console.error('Clerk initialization error:', error);
    isLoading.set(false);
    throw error;
  }
}

// Sign Up Function
export async function signUp({
  firstName,
  lastName,
  email,
  password,
  phoneNumber
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}) {
  await loadClerk();

  if (!window.Clerk?.client) {
    throw new Error('Clerk not initialized');
  }

  try {
    const signUpAttempt = await window.Clerk.client.signUp.create({
      emailAddress: email,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    // Handle sign-up verification
    if (signUpAttempt.status !== 'complete') {
      // Prepare email verification
      const emailVerification = await signUpAttempt.prepareEmailAddressVerification({
        strategy: 'email_code'
      });

      if (emailVerification.status !== 'complete') {
        throw new Error('Email verification required');
      }
    }

    return signUpAttempt;
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// Sign In Function
export async function signIn({
  email,
  password
}: {
  email: string;
  password: string;
}) {
  await loadClerk();

  if (!window.Clerk?.client) {
    throw new Error('Clerk not initialized');
  }

  try {
    const signInAttempt = await window.Clerk.client.signIn.create({
      identifier: email,
      password
    });

    // Handle sign-in statuses
    if (signInAttempt.status !== 'complete') {
      // Prepare first factor verification
      const firstFactorVerification = await signInAttempt.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: signInAttempt.identifier || ''
      });

      if (firstFactorVerification.status !== 'complete') {
        throw new Error('Additional verification required');
      }
    }

    // Activate the session
    if (signInAttempt.createdSessionId) {
      await window.Clerk.setActive({ 
        session: signInAttempt.createdSessionId 
      });
      goto('/dashboard');
    }

    return signInAttempt;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// OAuth Sign In
export async function signInWithOAuth(
  provider: 'google' | 'github' | 'apple'
): Promise<void> {
  await loadClerk();

  if (!window.Clerk?.client) {
    throw new Error('Clerk not initialized');
  }

  try {
    // Initiate OAuth sign-in
    await window.Clerk.client.signIn.create({
      strategy: 'email_link', // Fallback strategy
      identifier: `${provider}_oauth`,
      redirectUrl: `${window.location.origin}/dashboard`
    });
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
    throw error;
  }
}

// Sign Out Function
export async function signOut(): Promise<void> {
  await loadClerk();

  if (!window.Clerk) {
    throw new Error('Clerk not initialized');
  }

  try {
    await window.Clerk.signOut();
    goto('/auth');
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Get Current User
export function getCurrentUser(): ClerkUser | null {
  return transformUser(window.Clerk?.user);
}

// Global window extension
declare global {
  interface Window {
    Clerk?: ClerkImport.Clerk;
  }
}

// Password Reset Function
export async function resetPassword(email: string): Promise<void> {
  await loadClerk();

  if (!window.Clerk?.client) {
    throw new Error('Clerk not initialized');
  }

  try {
    // Initiate password reset
    const passwordResetAttempt = await window.Clerk.client.signIn.forgotPassword.create({
      identifier: email
    });

    // Prepare password reset
    await passwordResetAttempt.prepareFirstFactor({
      strategy: 'reset_password_email_code'
    });

    // Optionally, you can add logic to handle the reset process
    // This might involve redirecting to a password reset verification page
    goto('/auth/reset-password-verification');
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
}