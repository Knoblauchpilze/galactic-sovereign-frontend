import { fail } from '@sveltejs/kit';
import { mapCoordinate } from '$lib/server/mappers/planet';
import { mapBuildingActionOverview } from '$lib/server/mappers/building';
import { deleteBuildingAction } from '$lib/server/planets';
import type { Actions, PageServerLoad } from './$types';

export type PlanetOverview = {
	name: string;
	coordinates: string;
	usedFields: number;
	totalFields: number;
};

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();

	const overview: PlanetOverview = {
		name: planet.name,
		coordinates: mapCoordinate(planet.coordinate),
		usedFields: planet.buildings.length,
		totalFields: planet.fields
	};

	return { overview, buildingAction: mapBuildingActionOverview(planet, universe) };
};

export const actions: Actions = {
	cancel: async ({ params }) => {
		const result = await deleteBuildingAction(params.id);

		if (!result.success) {
			return fail(500, { reason: result.reason });
		}

		return { success: true };
	}
};
