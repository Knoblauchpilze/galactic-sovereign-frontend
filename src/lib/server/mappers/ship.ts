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
	requirementsMet: boolean;
};

export type ActiveShipActionOverview = {
	shipName: string;
	count: number;
	nextCompletionAt: string;
	unitCompletionSeconds: number;
	nextRemainingSeconds: number;
	totalRemainingSeconds: number;
};

export type QueuedShipActionOverview = {
	shipName: string;
	count: number;
	totalDurationSeconds: number;
};

export type ShipActionsOverview = {
	active: ActiveShipActionOverview | null;
	queued: QueuedShipActionOverview[];
};

export function parseIsoDuration(duration: string): number {
	if (!duration) return 0;
	const regex = /P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;
	const matches = duration.match(regex);
	if (!matches) return 0;
	const days = parseFloat(matches[1] || '0');
	const hours = parseFloat(matches[2] || '0');
	const minutes = parseFloat(matches[3] || '0');
	const seconds = parseFloat(matches[4] || '0');
	return days * 86400 + hours * 3600 + minutes * 60 + seconds;
}

export function mapShipActionsOverview(
	planet: DtosPlanetDtoResponse,
	universe: DtosUniverseDtoResponse
): ShipActionsOverview {
	const actions = planet.ship_actions;
	if (!actions || actions.length === 0) {
		return { active: null, queued: [] };
	}

	const activeAction = actions[0];
	const activeShipDef = universe.ships.find((s) => s.id === activeAction.ship);
	const activeUnitSeconds = parseIsoDuration(activeAction.unit_completion_time);
	const activeNextRemainingSeconds = Math.max(
		0,
		(new Date(activeAction.next_completion_at).getTime() - Date.now()) / 1000
	);
	const activeTotalRemainingSeconds =
		activeNextRemainingSeconds + Math.max(0, activeAction.count - 1) * activeUnitSeconds;

	const active: ActiveShipActionOverview = {
		shipName: activeShipDef?.name ?? 'Unknown',
		count: activeAction.count,
		nextCompletionAt: activeAction.next_completion_at,
		unitCompletionSeconds: activeUnitSeconds,
		nextRemainingSeconds: activeNextRemainingSeconds,
		totalRemainingSeconds: activeTotalRemainingSeconds
	};

	const queued: QueuedShipActionOverview[] = [];

	for (let i = 1; i < actions.length; i++) {
		const action = actions[i];
		const shipDef = universe.ships.find((s) => s.id === action.ship);
		const unitSeconds = parseIsoDuration(action.unit_completion_time);
		const totalDurationSeconds = action.count * unitSeconds;

		queued.push({
			shipName: shipDef?.name ?? 'Unknown',
			count: action.count,
			totalDurationSeconds
		});
	}

	return { active, queued };
}

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
		completionSeconds: mapCompletionSeconds(ship, planet, universe),
		requirementsMet: mapRequirementsMet(ship, planet)
	}));
}

function mapRequirementsMet(ship: DtosShipDtoResponse, planet: DtosPlanetDtoResponse): boolean {
	return ship.building_requirements.every((requirement) => {
		const level = planet.buildings.find((b) => b.building === requirement.building)?.level ?? 0;
		return level >= requirement.level;
	});
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
