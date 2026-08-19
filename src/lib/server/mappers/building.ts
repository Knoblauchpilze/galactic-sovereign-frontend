import type {
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';

export type Building = {
	name: string;
	level: number;
};

export function mapPlanetBuildings(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): Building[] {
	return planet.buildings.map((planetBuilding) => {
		// universe buildings hold the definition (e.g. name), planet buildings only the level
		const definition = universe.buildings.find((b) => b.id === planetBuilding.building);

		return {
			name: definition?.name ?? 'Unknown',
			level: planetBuilding.level
		};
	});
}
