import { defineConfig } from 'vitest/config';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit(), enhancedImages()],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		coverage: {
			reporter: ['json'],
			include: ['src/**/*.{js,ts,svelte}'],
			exclude: ['**/index.ts']
		}
	}
});
