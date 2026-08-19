import type {
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';
import { formatAmount, formatProduction, formatStorage } from '$lib/format';

export type Resource = {
	name: string;
	amount: string;
	production: string;
	productionPositive: boolean;
	storage: string;
	full: boolean;
};

export function mapPlanetResources(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): Resource[] {
	return planet.resources.map((planetResource) => {
		// universe resources hold the definition (e.g. name), planet resources only the amount
		const definition = universe.resources.find((r) => r.id === planetResource.resource);
		// productions are defined per building, the planet production is their sum
		const production = planet.productions
			.filter((p) => p.resource === planetResource.resource)
			.reduce((total, p) => total + p.production, 0);
		const storage =
			planet.storages.find((s) => s.resource === planetResource.resource)?.storage ?? 0;

		return {
			name: definition?.name ?? 'Unknown',
			amount: formatAmount(planetResource.amount),
			production: formatProduction(production),
			productionPositive: production >= 0,
			storage: formatStorage(storage),
			full: planetResource.amount >= storage
		};
	});
}

export function mapCoordinate(coordinate: DtosPlanetDtoResponse['coordinate']): string {
	return `${coordinate.galaxy}:${coordinate.solar_system}:${coordinate.position}`;
}
