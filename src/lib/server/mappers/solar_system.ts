import type { DtosSolarSystemDtoResponse } from '$lib/api/galactic-sovereign/client';

type SolarSystemPlanet = NonNullable<DtosSolarSystemDtoResponse['planets']>[number];

export type SolarSystemOrbit = {
	position: number;
	planet: SolarSystemPlanet | null;
};

export function mapSolarSystemOrbits(
	solarSystem: DtosSolarSystemDtoResponse,
	orbitCount: number
): SolarSystemOrbit[] {
	const planetsByPosition = new Map(
		(solarSystem.planets ?? []).map((planet) => [planet.position, planet])
	);

	return [...Array(orbitCount).keys()].map((index) => {
		const position = index + 1;

		return {
			position,
			planet: planetsByPosition.get(position) ?? null
		};
	});
}
