import { mapLobbyPlayers } from '$lib/server/mappers/players';
import { getPlayersByApiUser } from '$lib/server/players';
import { getUniverses } from '$lib/server/universes';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apiUserId = params.api_user;

	const [apiUserPlayers, universes] = await Promise.all([
		getPlayersByApiUser(apiUserId),
		getUniverses()
	]);

	const players = mapLobbyPlayers(apiUserPlayers, universes);

	const joinedUniverseIds = new Set(apiUserPlayers.map((player) => player.universe));
	const hasJoinedAllUniverses =
		universes.length > 0 && universes.every((universe) => joinedUniverseIds.has(universe.id));

	return { apiUserId, players, hasJoinedAllUniverses };
};
