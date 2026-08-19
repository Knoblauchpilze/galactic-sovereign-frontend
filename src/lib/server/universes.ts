import { GAME_SERVICE_URL } from '$env/static/private';
import { Api } from '$lib/api/galactic-sovereign/client';
import type { DtosUniverseDtoResponse } from '$lib/api/galactic-sovereign/client';

export async function getUniverse(universeId: string): Promise<DtosUniverseDtoResponse | null> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.universes.universesDetail(universeId);

	return response?.data?.details ?? null;
}
