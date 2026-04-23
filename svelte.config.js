// https://kit.svelte.dev/docs/adapter-node
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// https://svelte.dev/docs/kit/adapter-node#Options
		adapter: adapter({ out: 'svelte-build' }),
		alias: { $styles: './src/styles' }
	}
};

export default config;
