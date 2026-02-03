import type { MainAction } from './actions';
import type { MainData } from './model';

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
				throw new Error('Inconsistent state for ResetMainPageAction');
			}
			return createInitialState();
		}
		case 'RecipeExtractionMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error('Inconsistent state for RecipeExtractionMessageReceivedAction');
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
				throw new Error('Inconsistent state for MoreThanOneRecipesAssessmentMessageReceivedAction');
			}
			return {
				...state,
				status: 'SELECT_RECIPE',
				errors: [`Number of recipes: ${action.numberOfRecipes}`],
			};
		}
		case 'SuggestionsMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error('Inconsistent state for SuggestionsMessageReceivedAction');
			}
			return {
				...state,
				status: 'SUCCESS',
				rating: action.message.rating,
				suggestions: action.message.suggestions,
			};
		}
		case 'RecipeAssessmentErrorMessageReceivedAction': {
			if (state.status !== 'PENDING') {
				throw new Error('Inconsistent state for RecipeAssessmentErrorMessageReceivedAction');
			}
			return {
				...state,
				status: 'FAILURE',
				errors: action.message.errors,
			};
		}
		// see https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking
		default: {
			const exhaustiveCheck: never = action;
			throw new Error(`Unknown action type: ${exhaustiveCheck['type']}`);
		}
	}
}
