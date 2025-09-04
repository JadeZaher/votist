import type { PageServerLoad } from './$types';
import { WP_ADMIN_PASSWORD, WP_BASE_URL } from '$env/static/private';
import { fetchCategories, formatCategory, formatPost } from '$lib/wordpress';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch(`${WP_BASE_URL}/posts?_embed&status=publish`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic admin:${WP_ADMIN_PASSWORD}`
		}
	});
	const categories = (await fetchCategories()).map(formatCategory);
	const posts = await res.json();
	return {
		posts: [...posts].map(formatPost),
		categories: categories
	};
};
