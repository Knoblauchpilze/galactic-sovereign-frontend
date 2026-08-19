import { getPlayersByApiUser } from '$lib/server/players';
import type { PageServerLoad } from './$types';

export type LobbyPlayer = {
	universe: string;
	player: string;
	homeworld: string;
};

export const load: PageServerLoad = async ({ params }) => {
	const apiUserId = params.api_user;

	const apiUserPlayers = await getPlayersByApiUser(apiUserId);

	const players: LobbyPlayer[] = apiUserPlayers.map((player) => ({
		universe: player.universe,
		player: player.name,
		homeworld: player.homeworld
	}));

	return { apiUserId, players };
};
