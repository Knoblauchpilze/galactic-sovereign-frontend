import { fail, redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { createPlayer, getPlayersByApiUser } from '$lib/server/players';
import { getUniverses } from '$lib/server/universes';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const apiUserId = params.api_user;

	const [apiUserPlayers, universes] = await Promise.all([
		getPlayersByApiUser(apiUserId),
		getUniverses()
	]);

	const joinedUniverseIds = new Set(apiUserPlayers.map((player) => player.universe));
	const availableUniverses = universes
		.filter((universe) => !joinedUniverseIds.has(universe.id))
		.map((universe) => ({ id: universe.id, name: universe.name }));

	return { apiUserId, availableUniverses };
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const apiUserId = params.api_user;
		const formData = await request.formData();
		const universe = formData.get('universe') as string;
		const name = formData.get('name') as string;

		if (!universe || !name) {
			return fail(400, { reason: 'invalid_input' });
		}

		const result = await createPlayer(apiUserId, universe, name);

		if (!result.success) {
			const statusByReason: Record<typeof result.reason, number> = {
				invalid_input: 400,
				name_taken: 409,
				server_error: 500
			};
			return fail(statusByReason[result.reason], { reason: result.reason });
		}

		redirect(
			303,
			resolve('/players/[player=id]/planets/[id=id]', {
				player: result.player.id,
				id: result.player.homeworld
			})
		);
	}
};
