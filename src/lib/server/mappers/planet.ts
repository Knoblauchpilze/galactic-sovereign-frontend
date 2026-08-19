import type {
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';
import { formatAmount } from '$lib/format';

export type Resource = {
	name: string;
	amount: string;
};

export function mapPlanetResources(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): Resource[] {
	return planet.resources.map((planetResource) => {
		// universe resources hold the definition (e.g. name), planet resources only the amount
		const definition = universe.resources.find((r) => r.id === planetResource.resource);

		return {
			name: definition?.name ?? 'Unknown',
			amount: formatAmount(planetResource.amount)
		};
	});
}

export function mapCoordinate(coordinate: DtosPlanetDtoResponse['coordinate']): string {
	return `${coordinate.galaxy}:${coordinate.solar_system}:${coordinate.position}`;
}
