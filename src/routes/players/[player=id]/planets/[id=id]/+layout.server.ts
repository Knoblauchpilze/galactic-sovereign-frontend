import { error } from '@sveltejs/kit';
import { getPlanet } from '$lib/server/planets';
import { getPlayer } from '$lib/server/players';
import { mapPlanetResources } from '$lib/server/mappers/planet';
import { mapPlayerPlanets } from '$lib/server/mappers/players';
import { getUniverse } from '$lib/server/universes';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const player = await getPlayer(params.player);
	if (!player) {
		error(404, 'Player not found');
	}

	const planets = mapPlayerPlanets(player.planets);

	const universe = await getUniverse(player.universe);
	if (!universe) {
		error(404, 'Universe not found');
	}

	const planet = await getPlanet(params.id);
	if (!planet) {
		error(404, 'Planet not found');
	}

	const resources = mapPlanetResources(planet, universe);

	return {
		player: params.player,
		playerName: player.name,
		apiUser: player.api_user,
		id: params.id,
		planets,
		resources,
		planet,
		universe
	};
};
