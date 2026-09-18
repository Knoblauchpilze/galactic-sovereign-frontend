import { error } from '@sveltejs/kit';
import { mapSolarSystemOrbits } from '$lib/server/mappers/solar_system';
import { getSolarSystem } from '$lib/server/universes';
import type { PageServerLoad } from './$types';

function constrainSearchParam(value: string | null, limit: number, fallback: number) {
	const parsedValue = Number(value ?? fallback);

	if (!Number.isFinite(parsedValue)) {
		return fallback;
	}

	return Math.min(limit, Math.max(1, Math.trunc(parsedValue)));
}

export const load: PageServerLoad = async ({ parent, url }) => {
	const { planet, universe } = await parent();
	const selectedGalaxy = constrainSearchParam(
		url.searchParams.get('galaxy'),
		universe.topology.galaxies,
		planet.coordinate.galaxy
	);
	const selectedSolarSystem = constrainSearchParam(
		url.searchParams.get('solarSystem'),
		universe.topology.solar_systems,
		planet.coordinate.solar_system
	);

	const solarSystem = await getSolarSystem(
		universe.id,
		selectedGalaxy - 1,
		selectedSolarSystem - 1
	);

	if (!solarSystem) {
		error(404, 'Solar system not found');
	}

	return {
		selectedGalaxy,
		selectedSolarSystem,
		solarSystem,
		orbits: mapSolarSystemOrbits(solarSystem, universe.topology.orbits)
	};
};
