import type { PageServerLoad } from './$types';

export type LobbyPlayer = {
	universe: string;
	player: string;
};

export const load: PageServerLoad = async ({ params }) => {
	const playerId = params.player;

	const players: LobbyPlayer[] = [
		{ universe: 'Andromeda Prime', player: 'StarFalcon' },
		{ universe: 'Nebula Cradle', player: 'IronNova' },
		{ universe: 'Void Expanse', player: 'DuskReaper' }
	];

	return { playerId, players };
};
