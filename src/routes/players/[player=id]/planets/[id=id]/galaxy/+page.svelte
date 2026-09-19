<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let galaxy = $derived(data.selectedGalaxy);
	let solarSystem = $derived(data.selectedSolarSystem);

	// keep selectors in sync when navigation (e.g. back/forward) changes the loaded data
	$effect(() => {
		galaxy = data.selectedGalaxy;
		solarSystem = data.selectedSolarSystem;
	});

	const galaxyLimit = $derived(data.universe.topology.galaxies);
	const solarSystemLimit = $derived(data.universe.topology.solar_systems);

	function constrainValue(value: number | undefined, limit: number) {
		if (!Number.isFinite(value)) {
			return 1;
		}

		return Math.min(limit, Math.max(1, Math.trunc(value as number)));
	}

	function changeValue(value: number, amount: number, limit: number) {
		return constrainValue(value + amount, limit);
	}

	function reloadGalaxyView() {
		goto(
			resolve(
				`/players/[player=id]/planets/[id=id]/galaxy?galaxy=${galaxy}&solarSystem=${solarSystem}`,
				{ player: page.params.player!, id: page.params.id! }
			),
			{
				keepFocus: true,
				noScroll: true,
				replaceState: true
			}
		);
	}
</script>

<main class="flex flex-col gap-4 px-6 py-6">
	<section
		class="flex flex-wrap items-center gap-4 bg-[#2a2a27] border border-[#444] rounded px-5 py-4"
	>
		<div class="flex items-center gap-2">
			<label for="galaxy" class="text-gray-400 text-sm font-medium">Galaxy</label>
			<div class="flex items-center">
				<button
					type="button"
					aria-label="Previous galaxy"
					onclick={() => {
						galaxy = changeValue(galaxy, -1, galaxyLimit);
						reloadGalaxyView();
					}}
					class="flex items-center justify-center w-9 h-9 rounded-l text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8592;
				</button>
				<input
					id="galaxy"
					type="number"
					min="1"
					max={galaxyLimit}
					step="1"
					bind:value={galaxy}
					onchange={() => {
						galaxy = constrainValue(galaxy, galaxyLimit);
						reloadGalaxyView();
					}}
					class="w-16 h-9 appearance-none text-center text-white bg-[#21211f] border-y border-[#444] outline-none"
				/>
				<button
					type="button"
					aria-label="Next galaxy"
					onclick={() => {
						galaxy = changeValue(galaxy, 1, galaxyLimit);
						reloadGalaxyView();
					}}
					class="flex items-center justify-center w-9 h-9 rounded-r text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8594;
				</button>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<label for="solar-system" class="text-gray-400 text-sm font-medium">Solar system</label>
			<div class="flex items-center">
				<button
					type="button"
					aria-label="Previous solar system"
					onclick={() => {
						solarSystem = changeValue(solarSystem, -1, solarSystemLimit);
						reloadGalaxyView();
					}}
					class="flex items-center justify-center w-9 h-9 rounded-l text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8592;
				</button>
				<input
					id="solar-system"
					type="number"
					min="1"
					max={solarSystemLimit}
					step="1"
					bind:value={solarSystem}
					onchange={() => {
						solarSystem = constrainValue(solarSystem, solarSystemLimit);
						reloadGalaxyView();
					}}
					class="w-16 h-9 appearance-none text-center text-white bg-[#21211f] border-y border-[#444] outline-none"
				/>
				<button
					type="button"
					aria-label="Next solar system"
					onclick={() => {
						solarSystem = changeValue(solarSystem, 1, solarSystemLimit);
						reloadGalaxyView();
					}}
					class="flex items-center justify-center w-9 h-9 rounded-r text-white bg-[#333] border border-[#444] hover:bg-[#444] cursor-pointer"
				>
					&#8594;
				</button>
			</div>
		</div>
	</section>

	<section class="overflow-x-auto bg-[#2a2a27] border border-[#444] rounded">
		<div
			class="grid min-w-2xl grid-cols-[6rem_minmax(12rem,1fr)_minmax(20rem,2fr)] border-b border-[#444] px-5 py-2 text-xs font-semibold uppercase text-gray-400"
		>
			<span>Orbit</span>
			<span>Planet</span>
			<span>Player</span>
		</div>
		{#each data.orbits as orbit (orbit.position)}
			<div
				class="grid min-h-10 min-w-2xl grid-cols-[6rem_minmax(12rem,1fr)_minmax(20rem,2fr)] items-center border-b border-[#444] px-5 py-2 text-sm text-white last:border-b-0"
			>
				<span>{orbit.position}</span>
				<span>{orbit.planet?.name ?? '-'}</span>
				<span class="font-mono text-gray-300">{orbit.planet?.player_name ?? '-'}</span>
			</div>
		{/each}
	</section>
</main>

<style>
	:global(input[type='number']::-webkit-inner-spin-button),
	:global(input[type='number']::-webkit-outer-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}

	:global(input[type='number']) {
		appearance: textfield;
		-moz-appearance: textfield;
	}
</style>
