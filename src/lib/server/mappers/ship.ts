import type {
	DtosPlanetDtoResponse,
	DtosUniverseDtoResponse
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
		}))
	}));
}
