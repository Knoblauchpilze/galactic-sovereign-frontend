import { fail } from '@sveltejs/kit';
import { mapPlanetBuildings } from '$lib/server/mappers/building';
import { createBuildingAction } from '$lib/server/planets';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();

	return { buildings: mapPlanetBuildings(planet, universe) };
};

export const actions: Actions = {
	upgrade: async ({ request, params }) => {
		const formData = await request.formData();
		const building = formData.get('building') as string;

		if (!building) {
			return fail(400, { reason: 'invalid_input' });
		}

		const result = await createBuildingAction(params.id, building);

		if (!result.success) {
			return fail(500, { reason: result.reason });
		}

		return { success: true };
	}
};
