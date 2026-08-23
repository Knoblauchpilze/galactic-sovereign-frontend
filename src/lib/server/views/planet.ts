import type { Resource } from '$lib/server/mappers/planet';

const resourceOrder = ['metal', 'crystal', 'deuterium'];

export function orderPlanetResources(resources: Resource[]): Resource[] {
	return resources
		.map((resource, index) => ({ resource, index }))
		.sort((left, right) => {
			const leftRank = resourceOrder.indexOf(left.resource.name.toLowerCase());
			const rightRank = resourceOrder.indexOf(right.resource.name.toLowerCase());
			const normalizedLeftRank = leftRank === -1 ? resourceOrder.length : leftRank;
			const normalizedRightRank = rightRank === -1 ? resourceOrder.length : rightRank;

			return normalizedLeftRank - normalizedRightRank || left.index - right.index;
		})
		.map(({ resource }) => resource);
}
