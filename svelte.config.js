import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		
		// Optional: additional Vercel-specific configurations
		files: {
			// Specify routes and static files if needed
			routes: './src/routes',
			appTemplate: './src/app.html'
		}
	}
};

export default config;