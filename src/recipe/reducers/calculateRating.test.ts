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

	it('lists the present encouraged and limited components separately', () => {
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
			encouragedPresent: ['vegetables'],
			encouragedTotal: 2,
			limitedPresent: ['redMeat'],
			limitedTotal: 2,
		});
	});
});

describe('ratingFraction', () => {
	it('rewards present encouraged and absent limited components', () => {
		// 1 of 2 encouraged present, 1 of 2 limited present (so 1 limited absent).
		expect(
			ratingFraction({
				encouragedPresent: ['veg'],
				encouragedTotal: 2,
				limitedPresent: ['salt'],
				limitedTotal: 2,
			}),
		).toBe(0.5);
	});

	it('reaches 1 when every encouraged is present and no limited is present', () => {
		expect(
			ratingFraction({
				encouragedPresent: ['veg', 'fiber'],
				encouragedTotal: 2,
				limitedPresent: [],
				limitedTotal: 2,
			}),
		).toBe(1);
	});

	it('is 0 when there are no weighted recommendations', () => {
		expect(ratingFraction({ encouragedPresent: [], encouragedTotal: 0, limitedPresent: [], limitedTotal: 0 })).toBe(
			0,
		);
	});
});

describe('limitedRatio', () => {
	it('is the share of limited components that are present', () => {
		expect(
			limitedRatio({ encouragedPresent: [], encouragedTotal: 0, limitedPresent: ['salt'], limitedTotal: 4 }),
		).toBe(0.25);
	});

	it('is 0 when there are no limited components', () => {
		expect(limitedRatio({ encouragedPresent: [], encouragedTotal: 0, limitedPresent: [], limitedTotal: 0 })).toBe(
			0,
		);
	});
});

describe('encouragedRatio', () => {
	it('is the share of encouraged components that are present', () => {
		expect(
			encouragedRatio({
				encouragedPresent: ['veg', 'fiber', 'milk'],
				encouragedTotal: 4,
				limitedPresent: [],
				limitedTotal: 0,
			}),
		).toBe(0.75);
	});

	it('is 0 when there are no encouraged components', () => {
		expect(
			encouragedRatio({ encouragedPresent: [], encouragedTotal: 0, limitedPresent: [], limitedTotal: 0 }),
		).toBe(0);
	});
});
