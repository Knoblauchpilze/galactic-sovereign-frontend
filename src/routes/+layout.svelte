<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.webp';
	import { page } from '$app/state';

	const pageTitles: Record<string, string> = {
		'/[api_user=id]/lobby': 'Lobby',
		'/[api_user=id]/join': 'Join a new universe',
		'/players/[player=id]/planets/[id=id]': 'Planet overview',
		'/players/[player=id]/planets/[id=id]/buildings': 'Buildings',
		'/players/[player=id]/planets/[id=id]/galaxy': 'Galaxy',
		'/players/[player=id]/planets/[id=id]/shipyard': 'Shipyard'
	};
	const pageTitle = $derived(pageTitles[page.route.id ?? '']);

	let { children } = $props();
</script>

<svelte:head>
	<title>{pageTitle ? `${pageTitle} | Galactic Sovereign` : 'Galactic Sovereign'}</title>
	<link rel="icon" href={favicon} />
</svelte:head>
{@render children()}
