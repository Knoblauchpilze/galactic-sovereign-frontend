import type {
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';

export type Resource = {
	name: string;
	amount: number;
	production: number;
	storage: number;
};

const resourceOrder = ['metal', 'crystal', 'deuterium'];

export function mapPlanetResources(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): Resource[] {
	return planet.resources
		.map((planetResource, index) => {
			// universe resources hold the definition (e.g. name), planet resources only the amount
			const definition = universe.resources.find((r) => r.id === planetResource.resource);
			// productions are defined per building, the planet production is their sum
			const production = planet.productions
				.filter((p) => p.resource === planetResource.resource)
				.reduce((total, p) => total + p.production, 0);

			return {
				resource: {
					name: definition?.name ?? 'Unknown',
					amount: planetResource.amount,
					production,
					storage: planet.storages.find((s) => s.resource === planetResource.resource)?.storage ?? 0
				},
				index
			};
		})
		.sort((left, right) => {
			const leftRank = resourceOrder.indexOf(left.resource.name.toLowerCase());
			const rightRank = resourceOrder.indexOf(right.resource.name.toLowerCase());
			const normalizedLeftRank = leftRank === -1 ? resourceOrder.length : leftRank;
			const normalizedRightRank = rightRank === -1 ? resourceOrder.length : rightRank;

			return normalizedLeftRank - normalizedRightRank || left.index - right.index;
		})
		.map(({ resource }) => resource);
}

export function mapCoordinate(coordinate: DtosPlanetDtoResponse['coordinate']): string {
	return `${coordinate.galaxy}:${coordinate.solar_system}:${coordinate.position}`;
}
