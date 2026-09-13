import { mapPlanetShips } from '$lib/server/mappers/ship';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();

	return {
		ships: mapPlanetShips(planet, universe)
	};
};
