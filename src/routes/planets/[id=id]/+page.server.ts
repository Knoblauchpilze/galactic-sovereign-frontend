import type { PageServerLoad } from './$types';

export type PlanetOverview = {
	name: string;
	coordinates: string;
	diameter: number;
	usedFields: number;
	totalFields: number;
};

export const load: PageServerLoad = async () => {
	const overview: PlanetOverview = {
		name: 'Homeworld',
		coordinates: '1:42:8',
		diameter: 12800,
		usedFields: 200,
		totalFields: 240
	};

	return { overview };
};
