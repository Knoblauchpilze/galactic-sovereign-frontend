import type {
	DtosBuildingDtoResponse,
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';
import { formatAmount } from '$lib/format';

export type BuildingCost = {
	name: string;
	cost: string;
	affordable: boolean;
};

export type Building = {
	name: string;
	level: number;
	costs: BuildingCost[];
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
			level: planetBuilding.level,
			costs: definition
				? mapUpgradeCosts(definition, planetBuilding.level + 1, planet, universe)
				: []
		};
	});
}

function mapUpgradeCosts(
	building: DtosBuildingDtoResponse,
	desiredLevel: number,
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): BuildingCost[] {
	return building.costs.map((baseCost) => {
		const definition = universe.resources.find((r) => r.id === baseCost.resource);
		const available = planet.resources.find((r) => r.resource === baseCost.resource)?.amount ?? 0;
		const cost = Math.floor(baseCost.cost * Math.pow(baseCost.progress, desiredLevel - 1));

		return {
			name: definition?.name ?? 'Unknown',
			cost: formatAmount(cost),
			affordable: available >= cost
		};
	});
}
