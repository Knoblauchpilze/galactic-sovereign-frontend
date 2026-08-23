import type { Building } from '$lib/server/mappers/building';

const prioritizedBuildingOrder = [
	'metal mine',
	'crystal mine',
	'deuterium synthetizer',
	'metal storage',
	'crystal storage',
	'deuterium tank',
	'shipyard'
];

export function orderPlanetBuildings(buildings: Building[]): Building[] {
	return buildings
		.map((building, index) => ({ building, index }))
		.sort((left, right) => {
			const leftName = left.building.name.toLowerCase();
			const rightName = right.building.name.toLowerCase();
			const leftRank = prioritizedBuildingOrder.indexOf(leftName);
			const rightRank = prioritizedBuildingOrder.indexOf(rightName);

			if (leftRank !== -1 || rightRank !== -1) {
				const normalizedLeftRank = leftRank === -1 ? prioritizedBuildingOrder.length : leftRank;
				const normalizedRightRank = rightRank === -1 ? prioritizedBuildingOrder.length : rightRank;

				if (normalizedLeftRank !== normalizedRightRank) {
					return normalizedLeftRank - normalizedRightRank;
				}
			}

			const byName = leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
			return byName || left.index - right.index;
		})
		.map(({ building }) => building);
}
