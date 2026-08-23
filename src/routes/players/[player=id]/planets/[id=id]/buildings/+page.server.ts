import { fail } from '@sveltejs/kit';
import { mapPlanetBuildings, mapRemainingSeconds } from '$lib/server/mappers/building';
import { createBuildingAction, deleteBuildingAction } from '$lib/server/planets';
import { orderPlanetBuildings } from '$lib/server/views/building';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();

	return {
		buildings: orderPlanetBuildings(mapPlanetBuildings(planet, universe)),
		actionBuildingId: planet.building_action?.building ?? null,
		actionRemainingSeconds: planet.building_action
			? mapRemainingSeconds(planet.building_action.completed_at)
			: null
	};
};

export const actions: Actions = {
	upgrade: async ({ request, params }) => {
		const formData = await request.formData();
		const building = formData.get('building') as string;

		if (!building) {
			return fail(400, { reason: 'invalid_input' });
		}

		const result = await createBuildingAction(params.id, building);

		console.log('result: ', JSON.stringify(result));

		if (!result.success) {
			return fail(500, { reason: result.reason });
		}

		return { success: true };
	},

	cancel: async ({ params }) => {
		const result = await deleteBuildingAction(params.id);

		if (!result.success) {
			return fail(500, { reason: result.reason });
		}

		return { success: true };
	}
};
