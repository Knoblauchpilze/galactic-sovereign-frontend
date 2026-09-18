import { error } from '@sveltejs/kit';
import { mapSolarSystemOrbits } from '$lib/server/mappers/solar_system';
import { getSolarSystem } from '$lib/server/universes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();
	const solarSystem = await getSolarSystem(
		universe.id,
		planet.coordinate.galaxy,
		planet.coordinate.solar_system
	);

	if (!solarSystem) {
		error(404, 'Solar system not found');
	}

	console.log('system: ', JSON.stringify(solarSystem));

	return {
		solarSystem,
		orbits: mapSolarSystemOrbits(solarSystem, universe.topology.orbits)
	};
};
