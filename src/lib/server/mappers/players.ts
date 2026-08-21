import type {
	DtosPlayerDtoResponse,
	DtosPlayerPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';
import { mapCoordinate } from './planet';

export type LobbyPlayer = {
	id: string;
	universe: string;
	player: string;
	homeworld: string;
};

export type PlayerPlanet = {
	name: string;
	coordinates: string;
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

export function mapPlayerPlanets(planets: DtosPlayerPlanetDtoResponse[]): PlayerPlanet[] {
	return planets.map((planet) => ({
		name: planet.name,
		coordinates: mapCoordinate(planet.coordinate)
	}));
}
