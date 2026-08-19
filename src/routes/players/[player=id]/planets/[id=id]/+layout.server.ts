import { error } from '@sveltejs/kit';
import { getPlanet } from '$lib/server/planets';
import { getPlayer } from '$lib/server/players';
import { mapPlanetResources } from '$lib/server/mappers/planet';
import { getUniverse } from '$lib/server/universes';
import type { LayoutServerLoad } from './$types';

export type Planet = {
	name: string;
	coordinates: string;
};

export const load: LayoutServerLoad = async ({ params }) => {
	const planets: Planet[] = [
		{ name: 'Homeworld', coordinates: '1:42:8' },
		{ name: 'Colony I', coordinates: '1:118:5' },
		{ name: 'Colony II', coordinates: '2:256:11' }
	];

	const player = await getPlayer(params.player);
	if (!player) {
		error(404, 'Player not found');
	}

	const universe = await getUniverse(player.universe);
	if (!universe) {
		error(404, 'Universe not found');
	}

	const planet = await getPlanet(params.id);
	if (!planet) {
		error(404, 'Planet not found');
	}

	const resources = mapPlanetResources(planet, universe);

	return { player: params.player, id: params.id, planets, resources, planet };
};
