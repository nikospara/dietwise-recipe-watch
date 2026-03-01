import type { MainAction } from './actions';
import type { MainData, SuggestionState } from './model';
import { acceptedSuggestion, rejectedSuggestion, undecided } from 'recipe/reducers/reduceSuggestionStatusAction';

export function createInitialState(): MainData {
	return {
		status: 'INITIAL',
	};
}

export function reducer(state: MainData, action: MainAction): MainData {
	switch (action.type) {
		case 'PrepareToAssessRecipeAction': {
			return {
				status: 'PENDING',
				url: action.url,
			};
		}
		case 'RecipeAssessmentFailedAction': {
			return {
				...state,
				status: 'FAILURE',
				errors: [action.error.message],
			};
		}
		case 'RecipeAssessmentCompletedAction': {
			if (state.status === 'PENDING') {
				return {
					...state,
					status: 'FAILURE',
					errors: ['The processing was interrupted'],
				};
			} else {
				return state;
			}
		}
		case 'ResetMainPageAction': {
			if (state.status === 'PENDING') {
				throw new Error('Inconsistent state for ResetMainPageAction: ' + state.status);
			}
			return createInitialState();
		}
		case 'RecipeExtractionMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error('Inconsistent state for RecipeExtractionMessageReceivedAction: ' + state.status);
			}
			return {
				...state,
				recipes: action.message.recipes.map((r) => {
					let text = r.recipe.text;
					if (typeof text === 'string') {
						text = text.replaceAll('\\n', '\n'); // Hack!
						text = text.trimStart(); // Hack!
					}
					return {
						...r.recipe,
						text,
					};
				}),
				detectionTypes: action.message.recipes.map((r) => r.detectionType),
				pageText: action.message.pageText,
			};
		}
		case 'MoreThanOneRecipesAssessmentMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error(
					'Inconsistent state for MoreThanOneRecipesAssessmentMessageReceivedAction: ' + state.status,
				);
			}
			return {
				...state,
				status: 'SELECT_RECIPE',
				errors: [`Number of recipes: ${action.numberOfRecipes}`],
			};
		}
		case 'SuggestionsMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error('Inconsistent state for SuggestionsMessageReceivedAction: ' + state.status);
			}
			const aggregateStateInitial: { ids: string[]; suggestions: { [key: string]: SuggestionState } } = {
				ids: [],
				suggestions: {},
			};
			const aggregateState = action.message.suggestions?.reduce((aggr, cur) => {
				const ids = [...aggr.ids, cur.id];
				const suggestionState: SuggestionState = {
					suggestion: cur,
					extra: undefined,
					status: 'UNDECIDED',
				};
				return {
					ids,
					suggestions: {
						...aggr.suggestions,
						[cur.id]: suggestionState,
					},
				};
			}, aggregateStateInitial);
			return {
				...state,
				status: 'SUCCESS',
				rating: action.message.rating,
				suggestionIds: aggregateState?.ids,
				suggestions: aggregateState?.suggestions,
				ingredientState: {},
			};
		}
		case 'RecipeAssessmentErrorMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error('Inconsistent state for RecipeAssessmentErrorMessageReceivedAction: ' + state.status);
			}
			return {
				...state,
				status: 'FAILURE',
				errors: action.message.errors,
			};
		}
		case 'SuggestionStatusAction': {
			if (state.status !== 'SUCCESS') {
				throw new Error('Inconsistent state for SuggestionStatusAction: ' + state.status);
			}
			const target = state.suggestions?.[action.id];
			if (!target) throw new Error('No suggestion with id ' + action.id);
			const currentRecipe = state.recipes?.[0];
			if (!currentRecipe) throw new Error('Got suggestions without a recipe');
			const oldStatus = target.status;
			const newStatus = action.status;
			if (oldStatus !== newStatus) {
				switch (newStatus) {
					case 'ACCEPTED': {
						return acceptedSuggestion(state, action, target);
					}
					case 'REJECTED': {
						return rejectedSuggestion(state, action, target);
					}
					case 'UNDECIDED': {
						return undecided(state, action, target);
					}
				}
			} else {
				return state;
			}
			// throw new Error('Illegal fallthrough'); // XXX VS Code claims the default below is illegal without this!!!
		}
		// see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
		default: {
			const exhaustiveCheck: never = action;
			throw new Error(`Unknown action type: ${exhaustiveCheck['type']}`);
		}
	}
}
