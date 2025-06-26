import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST = async ({ request, cookies }) => {
	try {
		const { email, password } = await request.json();
		if (!email || !password) {
			return json({ success: false, message: 'Email and password are required.' }, { status: 400 });
		}

		// Step 1: Create a sign-in attempt
		const signInRes = await fetch('https://api.clerk.com/v1/sign_ins', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.CLERK_SECRET_KEY}` // NOT JWKS_PUBLIC_KEY
			},
			body: JSON.stringify({
				identifier: email,
				password
			})
		});

		if (!signInRes.ok) {
			const text = await signInRes.text();
			console.error('Sign-in request failed:', signInRes.status, text);
			return json(
				{ success: false, message: `Sign-in failed: ${text}` },
				{ status: signInRes.status }
			);
		}

		let signInData;
		try {
			signInData = await signInRes.json();
		} catch (e) {
			return json(
				{ success: false, message: 'Error parsing Clerk sign-in response.' },
				{ status: 500 }
			);
		}

		if (signInData.status !== 'complete' || !signInData.created_session_id) {
			return json(
				{
					success: false,
					message: signInData?.errors?.[0]?.message || 'Invalid email or password.'
				},
				{ status: 401 }
			);
		}

		// Step 2: Get the session token
		const sessionRes = await fetch(
			`https://api.clerk.com/v1/sessions/${signInData.created_session_id}/tokens`,
			{
				headers: {
					Authorization: `Bearer ${env.CLERK_SECRET_KEY}`
				}
			}
		);

		if (!sessionRes.ok) {
			const text = await sessionRes.text();
			console.error('Session token request failed:', sessionRes.status, text);
			return json(
				{ success: false, message: `Session token failed: ${text}` },
				{ status: sessionRes.status }
			);
		}

		let sessionData;
		try {
			sessionData = await sessionRes.json();
		} catch (e) {
			return json(
				{ success: false, message: 'Error parsing Clerk session response.' },
				{ status: 500 }
			);
		}
		const sessionToken = sessionData?.jwt;

		if (sessionToken) {
			cookies.set('__session', sessionToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		}

		return json({ success: true });
	} catch (err) {
		let message = 'Login failed. Please check your credentials.';
		if (err instanceof Error && err.message) message = err.message;
		return json({ success: false, message }, { status: 401 });
	}
};
