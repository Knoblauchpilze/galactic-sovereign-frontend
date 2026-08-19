import { GAME_SERVICE_URL } from '$env/static/private';
import { Api } from '$lib/api/galactic-sovereign/client';
import type { DtosPlayerDtoResponse } from '$lib/api/galactic-sovereign/client';

export async function getPlayersByApiUser(userId: string): Promise<DtosPlayerDtoResponse[]> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.users.playersList(userId);

	return response?.data?.details ?? [];
}

export async function getPlayer(playerId: string): Promise<DtosPlayerDtoResponse | null> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.players.playersDetail(playerId);

	return response?.data?.details ?? null;
}
