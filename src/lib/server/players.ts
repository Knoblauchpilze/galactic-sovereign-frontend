import { GAME_SERVICE_URL } from '$env/static/private';
import { Api } from '$lib/api/galactic-sovereign/client';
import type { DtosPlayerDtoResponse } from '$lib/api/galactic-sovereign/client';

export async function getPlayersByApiUser(userId: string): Promise<DtosPlayerDtoResponse[]> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.users.playersList(userId);

	return response?.data?.details ?? [];
}

export type CreatePlayerSuccess = {
	success: true;
	player: DtosPlayerDtoResponse;
};

export type CreatePlayerFailure = {
	success: false;
	reason: 'name_taken' | 'invalid_input' | 'server_error';
};

export type CreatePlayerResult = CreatePlayerSuccess | CreatePlayerFailure;

export async function createPlayer(
	apiUserId: string,
	universeId: string,
	name: string
): Promise<CreatePlayerResult> {
	try {
		const client = new Api({ baseUrl: GAME_SERVICE_URL });
		const response = await client.players.playersCreate({
			api_user: apiUserId,
			universe: universeId,
			name
		});

		if (response?.data?.details) {
			return { success: true, player: response.data.details };
		}

		return { success: false, reason: 'server_error' };
	} catch (error) {
		// The generated client throws HttpResponse objects for non-2xx responses
		const httpResponse = error as { status?: number };

		switch (httpResponse.status) {
			case 400:
				return { success: false, reason: 'invalid_input' };
			case 409:
				return { success: false, reason: 'name_taken' };
		}

		return { success: false, reason: 'server_error' };
	}
}

export async function getPlayer(playerId: string): Promise<DtosPlayerDtoResponse | null> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.players.playersDetail(playerId);

	return response?.data?.details ?? null;
}
