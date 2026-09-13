import { error, fail } from '@sveltejs/kit';
import { mapPlanetShips } from '$lib/server/mappers/ship';
import { createShipAction } from '$lib/server/planets';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { planet, universe } = await parent();

	return {
		ships: mapPlanetShips(planet, universe)
	};
};

export const actions: Actions = {
	build: async ({ request, params }) => {
		const formData = await request.formData();
		const ship = formData.get('ship') as string;
		const count = Number(formData.get('count'));

		if (!ship || !Number.isInteger(count) || count < 1) {
			return fail(400, { reason: 'invalid_input' });
		}

		const result = await createShipAction(params.id, ship, count);

		if (!result.success) {
			if (result.reason === 'conflict') {
				return fail(409, { message: result.message });
			}

			error(500, 'Server error. Please try again later');
		}

		return { success: true };
	}
};
