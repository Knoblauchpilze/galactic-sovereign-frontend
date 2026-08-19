import { mapCoordinate } from '$lib/server/mappers/planet';
import type { PageServerLoad } from './$types';

export type PlanetOverview = {
	name: string;
	coordinates: string;
	usedFields: number;
	totalFields: number;
};

export const load: PageServerLoad = async ({ parent }) => {
	const { planet } = await parent();

	const overview: PlanetOverview = {
		name: planet.name,
		coordinates: mapCoordinate(planet.coordinate),
		usedFields: planet.buildings.length,
		totalFields: planet.fields
	};

	return { overview };
};
