import type {
	DtosBuildingDtoResponse,
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';
import { formatAmount } from '$lib/format';

export type BuildingCost = {
	name: string;
	cost: string;
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
			costs: definition ? mapUpgradeCosts(definition, planetBuilding.level + 1, universe) : []
		};
	});
}

function mapUpgradeCosts(
	building: DtosBuildingDtoResponse,
	desiredLevel: number,
	universe: DtosUniverseDtoResponse
): BuildingCost[] {
	return building.costs.map((baseCost) => {
		const definition = universe.resources.find((r) => r.id === baseCost.resource);

		return {
			name: definition?.name ?? 'Unknown',
			cost: formatAmount(Math.floor(baseCost.cost * Math.pow(baseCost.progress, desiredLevel - 1)))
		};
	});
}
