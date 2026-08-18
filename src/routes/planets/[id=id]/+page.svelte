<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedPlanet = $state(untrack(() => data.planets[0].coordinates));
</script>

<div class="flex w-full min-h-screen bg-[#21211f]">
	<nav class="w-48 shrink-0 bg-[#2a2a27] border-r border-[#444] py-6">
		<ul class="flex flex-col gap-1 px-2">
			<li>
				<button
					class="w-full text-left px-4 py-2 rounded text-sm font-medium text-white bg-[#444] cursor-pointer"
				>
					Overview
				</button>
			</li>
			<li>
				<button
					class="w-full text-left px-4 py-2 rounded text-sm font-medium text-gray-400 cursor-pointer transition-colors hover:bg-[#444] hover:text-white"
				>
					Buildings
				</button>
			</li>
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

		<main class="flex flex-col gap-4 px-6 py-6">
			{#each data.buildings as building (building.name)}
				<div
					class="flex items-center justify-between px-5 py-4 bg-[#2a2a27] border border-[#444] rounded"
				>
					<div class="flex flex-col gap-1">
						<span class="text-white font-medium">{building.name}</span>
						<span class="text-gray-400 text-xs">{building.description}</span>
						<span class="text-gray-400 text-xs uppercase tracking-wider mt-1"
							>Level {building.level}</span
						>
					</div>
					<button
						class="px-5 py-2 bg-[#444] text-white border-0 rounded text-sm font-medium cursor-pointer transition-colors hover:bg-[#555] active:bg-[#333]"
					>
						Upgrade
					</button>
				</div>
			{/each}
		</main>
	</div>
</div>
