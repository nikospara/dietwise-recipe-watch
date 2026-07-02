import { describe, expect, it } from 'vitest';
import { calculateRating, encouragedRatio, limitedRatio, ratingFraction } from './calculateRating';
import type { MainData, ScoringData } from '@/recipe/model';

function stateWithScoring(scoringData: ScoringData): MainData {
	return {
		status: 'SUCCESS',
		emptySuggestionsFromServer: false,
		lang: 'en',
		scoringData,
	};
}

describe('calculateRating', () => {
	it('returns undefined when there is no scoring data', () => {
		const state: MainData = { status: 'PENDING', emptySuggestionsFromServer: false, lang: 'en' };
		expect(calculateRating(state)).toBeUndefined();
	});

	it('counts present encouraged and present limited components separately', () => {
		const state = stateWithScoring({
			totalNumberOfRecomendations: 4,
			recommendationWeights: {
				redMeat: 'LIMITED',
				sodium: 'LIMITED',
				vegetables: 'ENCOURAGED',
				fiber: 'ENCOURAGED',
			},
			recommendationsPerIngredient: {
				i1: ['redMeat'],
				i2: ['vegetables'],
			},
		});

		// redMeat present (limited), vegetables present (encouraged); sodium and fiber absent.
		expect(calculateRating(state)).toEqual({
			encouragedPresent: 1,
			encouragedTotal: 2,
			limitedPresent: 1,
			limitedTotal: 2,
		});
	});
});

describe('ratingFraction', () => {
	it('rewards present encouraged and absent limited components', () => {
		// 1 of 2 encouraged present, 1 of 2 limited present (so 1 limited absent).
		expect(ratingFraction({ encouragedPresent: 1, encouragedTotal: 2, limitedPresent: 1, limitedTotal: 2 })).toBe(
			0.5,
		);
	});

	it('reaches 1 when every encouraged is present and no limited is present', () => {
		expect(ratingFraction({ encouragedPresent: 2, encouragedTotal: 2, limitedPresent: 0, limitedTotal: 2 })).toBe(
			1,
		);
	});

	it('is 0 when there are no weighted recommendations', () => {
		expect(ratingFraction({ encouragedPresent: 0, encouragedTotal: 0, limitedPresent: 0, limitedTotal: 0 })).toBe(
			0,
		);
	});
});

describe('limitedRatio', () => {
	it('is the share of limited components that are present', () => {
		expect(limitedRatio({ encouragedPresent: 0, encouragedTotal: 0, limitedPresent: 1, limitedTotal: 4 })).toBe(
			0.25,
		);
	});

	it('is 0 when there are no limited components', () => {
		expect(limitedRatio({ encouragedPresent: 0, encouragedTotal: 0, limitedPresent: 0, limitedTotal: 0 })).toBe(0);
	});
});

describe('encouragedRatio', () => {
	it('is the share of encouraged components that are present', () => {
		expect(encouragedRatio({ encouragedPresent: 3, encouragedTotal: 4, limitedPresent: 0, limitedTotal: 0 })).toBe(
			0.75,
		);
	});

	it('is 0 when there are no encouraged components', () => {
		expect(encouragedRatio({ encouragedPresent: 0, encouragedTotal: 0, limitedPresent: 0, limitedTotal: 0 })).toBe(
			0,
		);
	});
});
