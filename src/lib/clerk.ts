import { writable } from 'svelte/store';
import { goto } from '$app/navigation';

// Clerk configuration
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

// Auth stores
export const user = writable(null);
export const isAuthenticated = writable(false);
export const isLoading = writable(true);

// Ensure Clerk is loaded
async function loadClerk() {
  if (typeof window !== 'undefined' && !window.Clerk) {
    const { Clerk } = await import('@clerk/clerk-js');
    window.Clerk = new Clerk(PUBLISHABLE_KEY);
  }
}

// Initialize Clerk
export async function initClerk() {
  await loadClerk();

  if (!window.Clerk) {
    throw new Error('Clerk failed to initialize');
  }

  try {
    await window.Clerk.load({
      afterSignIn: (session) => {
        user.set(session.user);
        isAuthenticated.set(true);
        isLoading.set(false);
      },
      afterSignOut: () => {
        user.set(null);
        isAuthenticated.set(false);
        isLoading.set(false);
      }
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

    // Handle verification steps
    if (signUpAttempt.status === 'need_email_verification') {
      await signUpAttempt.prepareEmailAddressVerification({
        strategy: 'email_code'
      });
    }

    if (phoneNumber && signUpAttempt.status === 'need_phone_verification') {
      await signUpAttempt.preparePhoneNumberVerification({
        strategy: 'phone_code'
      });
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
    switch (signInAttempt.status) {
      case 'complete':
        await signInAttempt.createdSessionId;
        await window.Clerk.setActive({ session: signInAttempt.createdSessionId });
        goto('/dashboard');
        return signInAttempt;
      case 'need_email_verification':
        await signInAttempt.prepareEmailAddressVerification({
          strategy: 'email_code'
        });
        throw new Error('Email verification required');
      case 'need_phone_verification':
        await signInAttempt.preparePhoneNumberVerification({
          strategy: 'phone_code'
        });
        throw new Error('Phone verification required');
      default:
        throw new Error('Sign in failed');
    }
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// OAuth Sign In
export async function signInWithOAuth(provider: 'google' | 'github' | 'apple') {
  await loadClerk();

  if (!window.Clerk?.client) {
    throw new Error('Clerk not initialized');
  }

  try {
    const signIn = await window.Clerk.client.signIn.create({
      strategy: provider
    });

    // Redirect to OAuth provider
    await signIn.authenticate({
      strategy: provider,
      redirectUrl: `${window.location.origin}/dashboard`
    });
  } catch (error) {
    console.error(`${provider} sign in error:`, error);
    throw error;
  }
}

// Sign Out Function
export async function signOut() {
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
export function getCurrentUser() {
  return window.Clerk?.user || null;
}

// Add type declaration for window
declare global {
  interface Window {
    Clerk?: any;
  }
}