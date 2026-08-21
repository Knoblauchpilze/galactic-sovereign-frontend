import type {
	DtosPlayerDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';

export type LobbyPlayer = {
	id: string;
	universe: string;
	player: string;
	homeworld: string;
};

export function mapLobbyPlayers(
	players: DtosPlayerDtoResponse[],
	universes: DtosUniverseDtoResponse[]
): LobbyPlayer[] {
	return players.map((player) => ({
		id: player.id,
		// universes hold the definition (e.g. name), players only reference the universe id
		universe: universes.find((universe) => universe.id === player.universe)?.name ?? 'Unknown',
		player: player.name,
		homeworld: player.homeworld
	}));
}
