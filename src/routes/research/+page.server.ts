import { env } from '$env/dynamic/private';
import { redirect } from '@sveltejs/kit';
import { fetchCategories, formatCategory, formatPost } from '$lib/wordpress';

// Fallback data when WordPress API fails
const getFallbackData = () => ({
	posts: [
		{
			title: 'Research Coming Soon',
			date: new Date(),
			imageUrl: '/placeholder-research.jpg',
			excerpt:
				'We are currently setting up our research content. Please check back soon for the latest insights and analysis.',
			slug: 'research-coming-soon',
			tag: 'Announcement',
			readingTime: '2 min read',
			meta: '',
			content: 'Research content will be available soon.'
		}
	],
	categories: [{ name: 'General' }, { name: 'Policy' }, { name: 'Analysis' }]
});

export const load = async ({ fetch, locals }: { fetch: typeof globalThis.fetch; locals: any }) => {
	const { userId } = await locals.auth();
	if (!userId) {
		throw redirect(302, '/sign-in');
	}

	console.log('Research +page.server.ts load function called');

	// Check if environment variables are available
	if (!env.WP_BASE_URL || !env.WP_ADMIN_PASSWORD) {
		console.warn('WordPress environment variables not configured, using fallback data');
		return getFallbackData();
	}

	try {
		// Fetch posts with timeout
		const postsPromise = fetch(`${env.WP_BASE_URL}posts?_embed&status=publish`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic admin:${env.WP_ADMIN_PASSWORD}`
			},
			signal: AbortSignal.timeout(10000) // 10 second timeout
		});

		// Fetch categories with timeout
		const categoriesPromise = fetchCategories();

		// Wait for both requests with timeout
		const [postsRes, categoriesData] = await Promise.allSettled([postsPromise, categoriesPromise]);

		let posts: any[] = [];
		let categories: any[] = [];

		// Handle posts response
		if (postsRes.status === 'fulfilled' && postsRes.value.ok) {
			try {
				const postsData = await postsRes.value.json();
				console.log('Posts fetched successfully:', postsData.length);
				posts = Array.isArray(postsData) ? postsData.map(formatPost) : [];
			} catch (parseError) {
				console.error('Error parsing posts JSON:', parseError);
				posts = [];
			}
		} else {
			console.error(
				'Failed to fetch posts:',
				postsRes.status === 'rejected' ? postsRes.reason : 'HTTP error'
			);
			posts = [];
		}

		// Handle categories response
		if (categoriesData.status === 'fulfilled') {
			try {
				categories = Array.isArray(categoriesData.value)
					? categoriesData.value.map(formatCategory)
					: [];
				console.log('Categories fetched successfully:', categories.length);
			} catch (parseError) {
				console.error('Error parsing categories:', parseError);
				categories = [];
			}
		} else {
			console.error(
				'Failed to fetch categories:',
				categoriesData.status === 'rejected' ? categoriesData.reason : 'HTTP error'
			);
			categories = [];
		}

		// If we have no posts, use fallback data
		if (posts.length === 0) {
			console.warn('No posts available, using fallback data');
			return getFallbackData();
		}

		return {
			posts,
			categories: categories.length > 0 ? categories : [{ name: 'General' }]
		};
	} catch (error) {
		console.error('Critical error in research page load:', error);

		// Return fallback data for any critical errors
		return getFallbackData();
	}
};
