import { GAME_SERVICE_URL } from '$env/static/private';
import { Api } from '$lib/api/galactic-sovereign/client';
import type { DtosPlanetDtoResponse } from '$lib/api/galactic-sovereign/client';

export async function getPlanet(planetId: string): Promise<DtosPlanetDtoResponse | null> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.planets.planetsDetail(planetId);

	return response?.data?.details ?? null;
}
