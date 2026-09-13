import {
	ModelsScalingMode,
	type DtosBuildingShipSpeedupDtoResponse,
	type DtosPlanetDtoResponse,
	type DtosShipDtoResponse,
	type DtosUniverseDtoResponse
} from '$lib/api/galactic-sovereign/client';

export type ShipCost = {
	name: string;
	cost: number;
	available: number;
};

export type Ship = {
	id: string;
	name: string;
	available: number;
	costs: ShipCost[];
	completionSeconds: number;
};

export function mapPlanetShips(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): Ship[] {
	return universe.ships.map((ship) => ({
		id: ship.id,
		name: ship.name,
		available: planet.ships.find((planetShip) => planetShip.ship === ship.id)?.count ?? 0,
		costs: ship.costs.map((cost) => ({
			name: universe.resources.find((resource) => resource.id === cost.resource)?.name ?? 'Unknown',
			cost: cost.cost,
			available:
				planet.resources.find((resource) => resource.resource === cost.resource)?.amount ?? 0
		})),
		completionSeconds: mapCompletionSeconds(ship, planet, universe)
	}));
}

function calculateShipSpeedupFactor(
	speedup: DtosBuildingShipSpeedupDtoResponse,
	level: number
): number {
	switch (speedup.scaling) {
		case ModelsScalingMode.LinearScaling:
			return speedup.base + speedup.progress * level;
		case ModelsScalingMode.GeometricScaling:
			return speedup.base + Math.pow(speedup.progress, level);
		default:
			return 1;
	}
}

function calculateShipyardThroughput(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): number {
	let throughput = 1.0;

	for (const planetBuilding of planet.buildings) {
		const definition = universe.buildings.find((b) => b.id === planetBuilding.building);
		if (definition?.ship_speedup) {
			throughput *= calculateShipSpeedupFactor(definition.ship_speedup, planetBuilding.level);
		}
	}

	return throughput > 0 ? throughput : 1.0;
}

function mapCompletionSeconds(
	ship: DtosShipDtoResponse,
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): number {
	// matches determineCompletionTime from the galactic-sovereign backend
	const buildTimeHours = ship.costs.reduce((total, baseCost) => {
		const definition = universe.resources.find((r) => r.id === baseCost.resource);
		return total + baseCost.cost * (definition?.shipyard_build_time_hours_per_unit ?? 0);
	}, 0);

	const throughput = calculateShipyardThroughput(planet, universe);
	return Math.floor((buildTimeHours * 3600) / throughput);
}
