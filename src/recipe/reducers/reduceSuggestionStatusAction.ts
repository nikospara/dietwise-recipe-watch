import type { SuggestionStatusAction } from 'recipe/actions';
import type { MainData, SuggestionState } from 'recipe/model';

export function acceptedSuggestion(state: MainData, action: SuggestionStatusAction, target: SuggestionState): MainData {
	if (target.suggestion.target.type === 'INGREDIENT') {
		const newSuggestionState: SuggestionState = {
			...target,
			status: 'ACCEPTED',
		};
		const targetIngredientId = target.suggestion.target.ingredient;
		let newSuggestions = state.suggestions;
		// deactivate the previous selected for the same ingredient
		const previouslySelectedSuggestionId = state.ingredientState?.[targetIngredientId];
		if (previouslySelectedSuggestionId) {
			const previouslySelectedSuggestion = state.suggestions?.[previouslySelectedSuggestionId];
			if (!previouslySelectedSuggestion) {
				throw new Error(
					`The previous suggestion for ingredient does not exist: i: ${targetIngredientId}, s: ${previouslySelectedSuggestionId}`,
				);
			}
			newSuggestions = {
				...newSuggestions,
				[previouslySelectedSuggestionId]: {
					...previouslySelectedSuggestion,
					status: 'UNDECIDED',
				},
			};
		}
		// mark the new suggestion as accepted
		newSuggestions = {
			...newSuggestions,
			[action.key]: newSuggestionState,
		};
		// assign the suggestion to the ingredient
		const newIngredientState = {
			...state.ingredientState,
			[targetIngredientId]: action.key,
		};
		return {
			...state,
			suggestions: newSuggestions,
			ingredientState: newIngredientState,
		};
	} else {
		// no RECIPE-level suggestions so far
		return state;
	}
}

export function rejectedSuggestion(state: MainData, action: SuggestionStatusAction, target: SuggestionState): MainData {
	if (target.suggestion.target.type === 'INGREDIENT') {
		const newSuggestionState: SuggestionState = {
			...target,
			status: 'REJECTED',
		};
		const targetIngredientId = target.suggestion.target.ingredient;
		// mark the new suggestion
		const newSuggestions = {
			...state.suggestions,
			[action.key]: newSuggestionState,
		};
		// assign undefined to the ingredient, only if previously related to this suggestion
		let newIngredientState = state.ingredientState;
		const previouslySelectedSuggestionId = state.ingredientState?.[targetIngredientId];
		if (previouslySelectedSuggestionId === action.key) {
			newIngredientState = {
				...state.ingredientState,
				[targetIngredientId]: undefined,
			};
		}
		return {
			...state,
			suggestions: newSuggestions,
			ingredientState: newIngredientState,
		};
	} else {
		// no RECIPE-level suggestions so far
		return state;
	}
}

export function undecided(state: MainData, action: SuggestionStatusAction, target: SuggestionState): MainData {
	if (target.suggestion.target.type === 'INGREDIENT') {
		const newSuggestionState: SuggestionState = {
			...target,
			status: 'UNDECIDED',
		};
		const targetIngredientId = target.suggestion.target.ingredient;
		// mark the new suggestion
		const newSuggestions = {
			...state.suggestions,
			[action.key]: newSuggestionState,
		};
		// assign undefined to the ingredient, only if previously related to this suggestion
		let newIngredientState = state.ingredientState;
		const previouslySelectedSuggestionId = state.ingredientState?.[targetIngredientId];
		if (previouslySelectedSuggestionId === action.key) {
			newIngredientState = {
				...state.ingredientState,
				[targetIngredientId]: undefined,
			};
		}
		return {
			...state,
			suggestions: newSuggestions,
			ingredientState: newIngredientState,
		};
	} else {
		// no RECIPE-level suggestions so far
		return state;
	}
}
