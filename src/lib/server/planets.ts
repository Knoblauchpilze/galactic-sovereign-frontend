import { GAME_SERVICE_URL } from '$env/static/private';
import { Api } from '$lib/api/galactic-sovereign/client';
import type { DtosPlanetDtoResponse } from '$lib/api/galactic-sovereign/client';

export async function getPlanet(planetId: string): Promise<DtosPlanetDtoResponse | null> {
	const client = new Api({ baseUrl: GAME_SERVICE_URL });
	const response = await client.planets.planetsDetail(planetId);

	return response?.data?.details ?? null;
}

export type CreateBuildingActionResult =
	{ success: true } | { success: false; reason: 'server_error' };

export async function createBuildingAction(
	planetId: string,
	buildingId: string
): Promise<CreateBuildingActionResult> {
	try {
		const client = new Api({ baseUrl: GAME_SERVICE_URL });
		await client.planets.actionsCreate(planetId, { building: buildingId });

		return { success: true };
	} catch {
		return { success: false, reason: 'server_error' };
	}
}

export type DeleteBuildingActionResult =
	{ success: true } | { success: false; reason: 'server_error' };

export async function deleteBuildingAction(planetId: string): Promise<DeleteBuildingActionResult> {
	try {
		const client = new Api({ baseUrl: GAME_SERVICE_URL });
		await client.planets.actionsDelete(planetId);

		return { success: true };
	} catch {
		return { success: false, reason: 'server_error' };
	}
}
