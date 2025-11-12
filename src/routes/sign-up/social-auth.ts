import { goto } from '$app/navigation';
import { browser } from '$app/environment';

export async function handleSocialAuth(provider: 'linkedin' | 'google', isSignUp: boolean = false) {
  if (!browser) return;

  const clerk = (window as any).Clerk;
  if (!clerk) {
    console.error('Clerk is not initialized');
    alert('Authentication service is not available. Please try again.');
    return;
  }

  try {
    // Use signUp for new accounts, signIn for existing accounts
    const authMethod = isSignUp ? clerk.client.signUp : clerk.client.signIn;

    // Try LinkedIn OIDC first (recommended), fall back to legacy if that fails
    const linkedinStrategies = ['oauth_linkedin_oidc', 'oauth_linkedin'];

    if (provider === 'linkedin') {
      // Try each LinkedIn strategy until one works
      for (const strategy of linkedinStrategies) {
        try {
          console.log(`Attempting LinkedIn with strategy: ${strategy}`);
          await authMethod.authenticateWithRedirect({
            strategy,
            redirectUrl: window.location.origin + '/sso-callback',
            redirectUrlComplete: window.location.origin + '/'
          });
          return; // Success, exit function
        } catch (err: any) {
          const errorMsg = err.errors?.[0]?.message || '';
          console.log(`Strategy ${strategy} failed:`, errorMsg);

          // If this strategy isn't allowed, try the next one
          if (errorMsg.includes('does not match one of the allowed values')) {
            continue; // Try next strategy
          } else {
            // Different error, throw it
            throw err;
          }
        }
      }
      // If we get here, none of the strategies worked
      throw new Error('LinkedIn sign-in is not enabled in your Clerk dashboard');
    } else {
      // For Google and other providers
      const strategy = provider === 'google' ? 'oauth_google' : `oauth_${provider}`;
      await authMethod.authenticateWithRedirect({
        strategy,
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin + '/'
      });
    }
  } catch (err: any) {
    console.error('Error during social auth:', err);
    const errorMessage = err.errors?.[0]?.message || err.errors?.[0]?.longMessage || err.message || `Failed to authenticate with ${provider}`;

    // Better error messaging
    if (errorMessage.includes('does not match one of the allowed values') || errorMessage.includes('not enabled')) {
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not enabled in your Clerk Dashboard.\n\nSteps to enable:\n1. Go to dashboard.clerk.com\n2. Navigate to "User & Authentication" → "Social Connections"\n3. Enable "LinkedIn OIDC" (recommended) or "LinkedIn"\n4. Click "Save"`);
    } else {
      alert(`Authentication error: ${errorMessage}`);
    }
  }
}
