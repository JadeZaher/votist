import { Clerk } from '@clerk/clerk-js';
import { writable, get } from 'svelte/store';

// Auth stores
export const user = writable<any>(null);
export const isLoaded = writable<boolean>(false);
export const isSignedIn = writable<boolean>(false);

// Initialize Clerk
let clerkInstance: Clerk | null = null;

export const initClerk = async (): Promise<Clerk> => {
  if (clerkInstance) return clerkInstance;
  
  const clerk = new Clerk(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
  await clerk.load();
  
  clerkInstance = clerk;
  
  // Set initial state
  isLoaded.set(true);
  isSignedIn.set(!!clerk.user);
  user.set(clerk.user);
  
  // Set up auth state listener
  clerk.addListener((emission) => {
    isSignedIn.set(!!emission.user);
    user.set(emission.user);
  });
  
  return clerk;
};

// Define interfaces for function parameters
interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface SignInParams {
  email: string;
  password: string;
}

// Authentication functions
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
  phoneNumber
}: SignUpParams) => {
  const clerk = await initClerk();
  
  if (!clerk.client) {
    throw new Error("Clerk client is not initialized");
  }
  
  try {
    const response = await clerk.client.signUp.create({
      emailAddress: email,
      password,
      firstName,
      lastName,
    });
    
    // Handle phone verification if needed
    if (phoneNumber && response.status === "complete" && response.createdUserId) {
      // The exact method to update a user with a phone number may vary by Clerk version
      // This is a simplified approach; adjust according to Clerk documentation
      try {
        await clerk.client.signUp.update({
          phoneNumber
        });
      } catch (error) {
        console.error("Failed to update phone number:", error);
      }
    }
    
    return response;
  } catch (error) {
    console.error("Sign up failed:", error);
    throw error;
  }
};

export const signIn = async ({
  email,
  password
}: SignInParams) => {
  const clerk = await initClerk();
  
  if (!clerk.client) {
    throw new Error("Clerk client is not initialized");
  }
  
  try {
    const response = await clerk.client.signIn.create({
      identifier: email,
      password,
    });
    
    return response;
  } catch (error) {
    console.error("Sign in failed:", error);
    throw error;
  }
};

export const signOut = async () => {
  const clerk = await initClerk();
  
  try {
    await clerk.signOut();
  } catch (error) {
    console.error("Sign out failed:", error);
    throw error;
  }
};

export const getClerkInstance = (): Clerk | null => clerkInstance;