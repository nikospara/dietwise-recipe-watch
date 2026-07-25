import { MainData, Rating } from '@/recipe/model';
// import { keyOfIngredientSuggestion } from '@/recipe/model';

type PresenceMap = { [key: string]: boolean };

export function calculateRating(state: MainData): Rating | undefined {
	if (!state.scoringData) return undefined;
	const presenceMap: PresenceMap = Object.keys(state.scoringData.recommendationWeights).reduce(
		(aggr, cur) => ({ ...aggr, [cur]: false }),
		{},
	);
	for (const ingredientId in state.scoringData.recommendationsPerIngredient) {
		let recommendations = state.scoringData.recommendationsPerIngredient[ingredientId];
		if (state.ingredientState?.[ingredientId]) {
			// the ingredient is replaced, calculate the contribution of its replacement
			// const acceptedSuggestionId = state.ingredientState?.[ingredientId];
			// const suggestionKey = keyOfIngredientSuggestion(acceptedSuggestionId, ingredientId);
			const suggestionKey = state.ingredientState?.[ingredientId];
			const acceptedSuggestion = state?.suggestions?.[suggestionKey];
			const maybeRecommendations = acceptedSuggestion?.suggestion.alternativeComponentNames;
			if (maybeRecommendations) recommendations = acceptedSuggestion?.suggestion.alternativeComponentNames;
		}
		for (let i = 0; i < recommendations.length; i++) {
			presenceMap[recommendations[i]] = true;
		}
	}
	const encouragedPresent: string[] = [];
	const limitedPresent: string[] = [];
	let encouragedTotal = 0;
	let limitedTotal = 0;
	for (const recommendationComponentName in state.scoringData.recommendationWeights) {
		const weight = state.scoringData.recommendationWeights[recommendationComponentName];
		const present = presenceMap[recommendationComponentName];
		if (weight === 'LIMITED') {
			limitedTotal += 1;
			if (present) limitedPresent.push(recommendationComponentName);
		} else if (weight === 'ENCOURAGED') {
			encouragedTotal += 1;
			if (present) encouragedPresent.push(recommendationComponentName);
		}
	}
	return { encouragedPresent, encouragedTotal, limitedPresent, limitedTotal };
}

/**
 * Collapses a {@link Rating} back to the single 0..1 value the star display uses: a recipe scores
 * for each ENCOURAGED component it contains and each LIMITED component it avoids.
 */
export function ratingFraction(rating: Rating): number {
	const total = rating.encouragedTotal + rating.limitedTotal;
	if (total === 0) return 0;
	const score = rating.encouragedPresent.length + (rating.limitedTotal - rating.limitedPresent.length);
	return score / total;
}

/** Share of LIMITED components present in the recipe (0..1); higher is worse. */
export function limitedRatio(rating: Rating): number {
	return rating.limitedTotal === 0 ? 0 : rating.limitedPresent.length / rating.limitedTotal;
}

/** Share of ENCOURAGED components present in the recipe (0..1); higher is better. */
export function encouragedRatio(rating: Rating): number {
	return rating.encouragedTotal === 0 ? 0 : rating.encouragedPresent.length / rating.encouragedTotal;
}
