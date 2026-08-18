import type { PageServerLoad } from './$types';

export type Building = {
	name: string;
	level: number;
	description: string;
};

export const load: PageServerLoad = async () => {
	const buildings: Building[] = [
		{ name: 'Metal Mine', level: 8, description: 'Produces metal from the planet crust.' },
		{ name: 'Metal Storage', level: 3, description: 'Increases the maximum metal capacity.' }
	];

	return { buildings };
};
