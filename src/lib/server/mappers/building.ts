import type {
	DtosBuildingDtoResponse,
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';

export type BuildingActionOverview = {
	buildingName: string;
	currentLevel: number;
	desiredLevel: number;
	completedAt: string;
	remainingSeconds: number;
};

export function mapBuildingActionOverview(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): BuildingActionOverview | null {
	const action = planet.building_action;
	if (!action) {
		return null;
	}

	const definition = universe.buildings.find((b) => b.id === action.building);

	return {
		buildingName: definition?.name ?? 'Unknown',
		currentLevel: action.desired_level - 1,
		desiredLevel: action.desired_level,
		completedAt: action.completed_at,
		remainingSeconds: mapRemainingSeconds(action.completed_at)
	};
}

export function mapRemainingSeconds(completedAt: string): number {
	return Math.max(0, (new Date(completedAt).getTime() - Date.now()) / 1000);
}

export type BuildingCost = {
	name: string;
	cost: number;
	available: number;
};

export type BuildingProductionGain = {
	name: string;
	gain: number;
};

export type Building = {
	id: string;
	name: string;
	level: number;
	costs: BuildingCost[];
	productionGains: BuildingProductionGain[];
	affordable: boolean;
};

export function mapPlanetBuildings(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): Building[] {
	return planet.buildings.map((planetBuilding) => {
		// universe buildings hold the definition (e.g. name), planet buildings only the level
		const definition = universe.buildings.find((b) => b.id === planetBuilding.building);
		const costs = definition
			? mapUpgradeCosts(definition, planetBuilding.level + 1, planet, universe)
			: [];
		const productionGains = definition
			? mapProductionGains(definition, planetBuilding.level, universe)
			: [];

		return {
			id: planetBuilding.building,
			name: definition?.name ?? 'Unknown',
			level: planetBuilding.level,
			costs,
			productionGains,
			affordable: costs.every((cost) => cost.available >= cost.cost)
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

		return {
			name: definition?.name ?? 'Unknown',
			cost: Math.floor(baseCost.cost * Math.pow(baseCost.progress, desiredLevel - 1)),
			available: planet.resources.find((r) => r.resource === baseCost.resource)?.amount ?? 0
		};
	});
}

function mapProductionGains(
	building: DtosBuildingDtoResponse,
	currentLevel: number,
	universe: DtosUniverseDtoResponse
): BuildingProductionGain[] {
	return building.productions
		.map((production) => {
			const definition = universe.resources.find((r) => r.id === production.resource);
			// matches determineActionResourceProduction from the galactic-sovereign backend
			const currentProduction =
				currentLevel * production.base * Math.pow(production.progress, currentLevel);
			const nextLevel = currentLevel + 1;
			const nextProduction = nextLevel * production.base * Math.pow(production.progress, nextLevel);

			return {
				name: definition?.name ?? 'Unknown',
				gain: Math.floor(nextProduction) - Math.floor(currentProduction)
			};
		})
		.filter((gain) => gain.gain !== 0);
}
