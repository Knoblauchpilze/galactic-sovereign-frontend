import { describe, expect, it } from 'vitest';
import { computeProductionForLevel } from './buildingProduction';

const SAMPLE_PRODUCTION = 17.8;
const SAMPLE_PROGRESS = 1.8;

describe.concurrent('Calculating building production', () => {
	it('should return 0 when level is 0', () => {
		const actual = computeProductionForLevel(SAMPLE_PRODUCTION, SAMPLE_PROGRESS, 0);
		expect(actual).toBe(0);
	});

	it('should return correct value when level is not 0', () => {
		let actual = computeProductionForLevel(SAMPLE_PRODUCTION, SAMPLE_PROGRESS, 5);
		expect(actual).toBe(1681);

		actual = computeProductionForLevel(SAMPLE_PRODUCTION, SAMPLE_PROGRESS, 14);
		expect(actual).toBe(934_034);
	});
});
