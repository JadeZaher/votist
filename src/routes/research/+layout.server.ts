import { wordpressCSS } from '$lib/wordpress';

export const load = async () => {
	console.log('Research +layout.server.ts load function called');

	try {
		// Try to get WordPress CSS, fallback to empty string if it fails
		const css = wordpressCSS || '';
		return {
			wordpressCSS: css
		};
	} catch (error) {
		console.error('Error loading WordPress CSS:', error);
		// Return empty CSS if there's an error
		return {
			wordpressCSS: ''
		};
	}
};
