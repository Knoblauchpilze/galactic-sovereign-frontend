import { error } from '@sveltejs/kit';
import { getPlayer } from '$lib/server/players';
import { getUniverse } from '$lib/server/universes';
import type { LayoutServerLoad } from './$types';

export type Planet = {
	name: string;
	coordinates: string;
};

export type Resource = {
	name: string;
	amount: string;
};

export const load: LayoutServerLoad = async ({ params }) => {
	const planets: Planet[] = [
		{ name: 'Homeworld', coordinates: '1:42:8' },
		{ name: 'Colony I', coordinates: '1:118:5' },
		{ name: 'Colony II', coordinates: '2:256:11' }
	];

	const resources: Resource[] = [
		{ name: 'Metal', amount: '12,480' },
		{ name: 'Crystal', amount: '6,215' },
		{ name: 'Deuterium', amount: '3,040' }
	];

	const player = await getPlayer(params.player);
	if (!player) {
		error(404, 'Player not found');
	}

	await getUniverse(player.universe);

	return { player: params.player, id: params.id, planets, resources };
};
