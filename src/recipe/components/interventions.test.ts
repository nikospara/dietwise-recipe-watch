import { describe, expect, it } from 'vitest';
import { INTERVENTION_COUNT, randomInterventionKey } from './interventions';

describe('randomInterventionKey', () => {
	it('maps the lowest random value to the first intervention', () => {
		expect(randomInterventionKey(() => 0)).toBe('interventions.1');
	});

	it('maps the highest random value to the last intervention', () => {
		expect(randomInterventionKey(() => 0.999999)).toBe(`interventions.${INTERVENTION_COUNT}`);
	});

	it('always returns a key within the configured range', () => {
		for (let i = 0; i < 1000; i++) {
			const index = Number(randomInterventionKey().split('.')[1]);
			expect(index).toBeGreaterThanOrEqual(1);
			expect(index).toBeLessThanOrEqual(INTERVENTION_COUNT);
		}
	});
});
