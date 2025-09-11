import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],

	server: {
		host: '0.0.0.0',
		port: 5173,
		watch: {
			usePolling: true,
			interval: 500, // Check for changes every 0.5 seconds
			ignored: ['**/.git/**']
		}
	},

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
