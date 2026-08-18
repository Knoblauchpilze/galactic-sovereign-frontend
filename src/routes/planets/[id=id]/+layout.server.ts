import type { LayoutServerLoad } from './$types';

export type Planet = {
	name: string;
	coordinates: string;
};

export type Resource = {
	name: string;
	amount: string;
};

export const load: LayoutServerLoad = async () => {
	const planets: Planet[] = [
		{ name: 'Homeworld', coordinates: '1:42:8' },
		{ name: 'Colony I', coordinates: '1:118:5' },
		{ name: 'Colony II', coordinates: '2:256:11' }
	];

	const resources: Resource[] = [
		{ name: 'Metal', amount: '12,480' },
		{ name: 'Crystal', amount: '6,215' },
		{ name: 'Deuterium', amount: '3,040' }
	];

	return { planets, resources };
};
