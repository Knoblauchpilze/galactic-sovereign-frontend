<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { formatAmount, formatProduction, formatStorage } from '$lib/format';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: import('svelte').Snippet } = $props();

	let isPlanetListOpen = $state(false);

	const currentPlanet = $derived(data.planets.find((planet) => planet.id === data.id));
	const otherPlanets = $derived(
		data.planets
			.filter((planet) => planet.id !== data.id)
			.map((planet) => ({
				...planet,
				href: resolve('/players/[player=id]/planets/[id=id]', {
					player: data.player,
					id: planet.id
				})
			}))
	);

	const navItems = $derived([
		{
			label: 'Overview',
			href: resolve('/players/[player=id]/planets/[id=id]', { player: data.player, id: data.id })
		},
		{
			label: 'Buildings',
			href: resolve('/players/[player=id]/planets/[id=id]/buildings', {
				player: data.player,
				id: data.id
			})
		}
	]);
</script>

<div class="flex w-full min-h-screen bg-[#21211f]">
	<nav class="w-48 shrink-0 bg-[#2a2a27] border-r border-[#444] py-6">
		<ul class="flex flex-col gap-1 px-2">
			{#each navItems as item (item.href)}
				<li>
					<a
						href={item.href}
						class="block w-full text-left px-4 py-2 rounded text-sm font-medium cursor-pointer transition-colors {page
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
				<details class="relative" bind:open={isPlanetListOpen}>
					<summary
						onclick={(event) => {
							if (otherPlanets.length === 0) {
								event.preventDefault();
							}
						}}
						class="px-4 py-2 rounded text-sm font-medium text-white bg-[#333] border border-[#444] list-none {otherPlanets.length ===
						0
							? 'cursor-default'
							: 'cursor-pointer'}"
					>
						{currentPlanet?.name} ({currentPlanet?.coordinates})
					</summary>
					<ul
						class="absolute left-0 z-10 mt-1 min-w-full whitespace-nowrap rounded border border-[#444] bg-[#333] py-1 shadow-lg"
					>
						{#each otherPlanets as planet (planet.id)}
							<li>
								<a
									href={planet.href}
									onclick={() => (isPlanetListOpen = false)}
									class="block px-4 py-2 text-sm font-medium text-gray-400 hover:bg-[#444] hover:text-white"
								>
									{planet.name} ({planet.coordinates})
								</a>
							</li>
						{/each}
					</ul>
				</details>
			</div>

			<div class="flex gap-6">
				{#each data.resources as resource (resource.name)}
					<div class="group relative flex flex-col items-end">
						<span class="text-gray-400 text-xs uppercase tracking-wider">{resource.name}</span>
						<span
							class="font-medium {resource.amount >= resource.storage
								? 'text-red-500'
								: 'text-white'}">{formatAmount(resource.amount)}</span
						>
						<div
							class="pointer-events-none absolute top-full right-0 z-10 mt-2 hidden group-hover:flex flex-col gap-1 whitespace-nowrap rounded border border-[#444] bg-[#333] px-3 py-2 text-sm text-white shadow-lg"
						>
							<span
								><span class="text-gray-400">Production:</span>
								<span class={resource.production >= 0 ? 'text-green-500' : 'text-red-500'}
									>{formatProduction(resource.production)}</span
								></span
							>
							<span
								><span class="text-gray-400">Storage:</span>
								<span
									class={resource.amount >= resource.storage ? 'text-red-500' : 'text-green-500'}
									>{formatStorage(resource.storage)}</span
								></span
							>
						</div>
					</div>
				{/each}
			</div>
		</header>

		{@render children()}
	</div>
</div>
