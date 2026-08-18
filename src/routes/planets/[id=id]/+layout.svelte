<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let selectedPlanet = $state(untrack(() => data.planets[0].coordinates));

	const navItems = $derived([
		{ label: 'Overview', href: resolve('/planets/[id=id]', { id: data.id }) },
		{ label: 'Buildings', href: resolve('/planets/[id=id]/buildings', { id: data.id }) }
	]);
</script>

<div class="flex w-full min-h-screen bg-[#21211f]">
	<nav class="w-48 shrink-0 bg-[#2a2a27] border-r border-[#444] py-6">
		<ul class="flex flex-col gap-1 px-2">
			{#each navItems as item (item.href)}
				<li>
					<a
						href={item.href}
						class="block w-full text-left px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors {$page
							.url.pathname === item.href
							? 'text-white bg-[#444]'
							: 'text-gray-400 hover:bg-[#444] hover:text-white'}"
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="flex flex-col flex-1">
		<header
			class="flex items-center justify-between gap-6 px-6 py-4 bg-[#2a2a27] border-b border-[#444]"
		>
			<div class="flex gap-2">
				<select
					bind:value={selectedPlanet}
					class="px-4 py-2 rounded text-sm font-medium text-white bg-[#333] border border-[#444] cursor-pointer"
				>
					{#each data.planets as planet (planet.coordinates)}
						<option value={planet.coordinates}>{planet.name} ({planet.coordinates})</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-6">
				{#each data.resources as resource (resource.name)}
					<div class="flex flex-col items-end">
						<span class="text-gray-400 text-xs uppercase tracking-wider">{resource.name}</span>
						<span class="text-white font-medium">{resource.amount}</span>
					</div>
				{/each}
			</div>
		</header>

		{@render children()}
	</div>
</div>
