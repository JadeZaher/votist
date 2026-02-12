import { browser } from '$app/environment';

export async function handleSocialAuth(provider: 'linkedin', isSignUp: boolean = false) {
  if (!browser) return;

  const clerk = (window as any).Clerk;
  if (!clerk) {
    console.error('Clerk is not initialized');
    alert('Authentication service is not available. Please try again.');
    return;
  }

  try {
    const authMethod = isSignUp ? clerk.client.signUp : clerk.client.signIn;

    // Try LinkedIn OIDC first (recommended), fall back to legacy if that fails
    const strategies = ['oauth_linkedin_oidc', 'oauth_linkedin'];

    for (const strategy of strategies) {
      try {
        console.log(`Attempting LinkedIn with strategy: ${strategy}`);
        await authMethod.authenticateWithRedirect({
          strategy,
          redirectUrl: window.location.origin + '/sso-callback',
          redirectUrlComplete: window.location.origin + '/'
        });
        return;
      } catch (err: any) {
        const errorMsg = err.errors?.[0]?.message || '';
        console.log(`Strategy ${strategy} failed:`, errorMsg);

        if (errorMsg.includes('does not match one of the allowed values')) {
          continue;
        } else {
          throw err;
        }
      }
    }

    throw new Error('LinkedIn sign-in is not enabled in your Clerk dashboard');
  } catch (err: any) {
    console.error('Error during social auth:', err);
    const errorMessage = err.errors?.[0]?.message || err.errors?.[0]?.longMessage || err.message || 'Failed to authenticate with LinkedIn';

    if (errorMessage.includes('does not match one of the allowed values') || errorMessage.includes('not enabled')) {
      alert('LinkedIn sign-in is not enabled in your Clerk Dashboard.\n\nSteps to enable:\n1. Go to dashboard.clerk.com\n2. Navigate to "User & Authentication" → "Social Connections"\n3. Enable "LinkedIn OIDC" (recommended) or "LinkedIn"\n4. Click "Save"');
    } else {
      alert(`Authentication error: ${errorMessage}`);
    }
  }
}
