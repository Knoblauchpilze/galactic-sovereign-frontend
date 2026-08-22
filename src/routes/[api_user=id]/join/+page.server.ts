import { getPlayersByApiUser } from '$lib/server/players';
import { getUniverses } from '$lib/server/universes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apiUserId = params.api_user;

	const [apiUserPlayers, universes] = await Promise.all([
		getPlayersByApiUser(apiUserId),
		getUniverses()
	]);

	const joinedUniverseIds = new Set(apiUserPlayers.map((player) => player.universe));
	const availableUniverses = universes
		.filter((universe) => !joinedUniverseIds.has(universe.id))
		.map((universe) => ({ id: universe.id, name: universe.name }));

	return { apiUserId, availableUniverses };
};
