import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';
import { formatPost } from '$lib/wordpress';

// Fallback data when WordPress API fails
const getFallbackPost = (slug: string) => ({
	title: 'Research Coming Soon',
	date: new Date(),
	imageUrl: '/votist-logo.png',
	excerpt:
		'We are currently setting up our research content. Please check back soon for the latest insights and analysis.',
	slug: slug,
	tag: 'Announcement',
	readingTime: '2 min read',
	meta: '',
	content: 'Research content will be available soon.'
});

export const load: PageServerLoad = async ({ fetch, params }) => {
	const slug = params.slug;
	console.log('Research slug page load function called for:', slug);

	// Check if environment variables are available
	if (!env.WP_BASE_URL || !env.WP_ADMIN_PASSWORD) {
		console.warn('WordPress environment variables not configured, using fallback data');
		return {
			post: getFallbackPost(slug)
		};
	}

	try {
		const res = await fetch(`${env.WP_BASE_URL}posts?_embed&slug=${slug}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Basic admin:${env.WP_ADMIN_PASSWORD}`
			},
			signal: AbortSignal.timeout(10000) // 10 second timeout
		});

		console.log('WordPress API response for slug:', res.status, res.statusText);

		if (!res.ok) {
			console.error('WordPress API error:', res.status, res.statusText);
			return {
				post: getFallbackPost(slug)
			};
		}

		const posts = await res.json();
		console.log('Posts fetched for slug:', posts.length);

		if (!Array.isArray(posts) || posts.length === 0) {
			console.warn('No posts found for slug:', slug);
			return {
				post: getFallbackPost(slug)
			};
		}

		const post = posts[0];
		return {
			post: formatPost(post)
		};
	} catch (error) {
		console.error('Error in research slug page load:', error);
		return {
			post: getFallbackPost(slug)
		};
	}
};
