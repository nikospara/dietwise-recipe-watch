import { MainData } from 'recipe/model';

type PresenceMap = { [key: string]: boolean };

export function calculateRating(state: MainData): number | undefined {
	if (!state.scoringData) return undefined;
	const presenceMap: PresenceMap = Object.keys(state.scoringData.recommendationWeights).reduce(
		(aggr, cur) => ({ ...aggr, [cur]: false }),
		{},
	);
	for (const key in state.scoringData.recommendationsPerIngredient) {
		if (state.ingredientState?.[key]) {
			// the ingredient is replaced
			// TODO Calculate the contribution of its replacement, from the DB
			continue;
		} else {
			const recommendations = state.scoringData.recommendationsPerIngredient[key];
			for (let i = 0; i < recommendations.length; i++) {
				presenceMap[recommendations[i]] = true;
			}
		}
	}
	let score = 0;
	for (const recommendationComponentName in state.scoringData.recommendationWeights) {
		const weight = state.scoringData.recommendationWeights[recommendationComponentName];
		const present = presenceMap[recommendationComponentName];
		if (weight === 'LIMITED' && !present) score += 1;
		else if (weight === 'ENCOURAGED' && present) score += 1;
	}
	return score / state.scoringData.totalNumberOfRecomendations;
}
