import { mapPlanetBuildings } from '$lib/server/mappers/building';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();

	return { buildings: mapPlanetBuildings(planet, universe) };
};
