import { getPlayersByApiUser } from '$lib/server/players';
import type { PageServerLoad } from './$types';

export type LobbyPlayer = {
	universe: string;
	player: string;
	homeworld: string;
};

export const load: PageServerLoad = async ({ params }) => {
	const playerId = params.player;

	const apiUserPlayers = await getPlayersByApiUser(playerId);

	const players: LobbyPlayer[] = apiUserPlayers.map((player) => ({
		universe: player.universe,
		player: player.name,
		homeworld: player.homeworld
	}));

	return { playerId, players };
};
