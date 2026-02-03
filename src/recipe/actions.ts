import type {
	RecipeAssessmentErrorMessage,
	RecipeAssessmentMessage,
	RecipeExtractionRecipeAssessmentMessage,
	SuggestionsRecipeAssessmentMessage,
} from './model';
import type { Action } from 'model';

export interface PrepareToAssessRecipeAction extends Action {
	type: 'PrepareToAssessRecipeAction';
	url: string;
}

export interface RecipeAssessmentFailedAction extends Action {
	type: 'RecipeAssessmentFailedAction';
	error: Error;
}

export interface RecipeAssessmentCompletedAction extends Action {
	type: 'RecipeAssessmentCompletedAction';
}

export interface ResetMainPageAction extends Action {
	type: 'ResetMainPageAction';
}

export interface RecipeExtractionMessageReceivedAction extends Action {
	type: 'RecipeExtractionMessageReceivedAction';
	message: RecipeExtractionRecipeAssessmentMessage;
}

export interface MoreThanOneRecipesAssessmentMessageReceivedAction extends Action {
	type: 'MoreThanOneRecipesAssessmentMessageReceivedAction';
	numberOfRecipes: number;
}

export interface SuggestionsMessageReceivedAction extends Action {
	type: 'SuggestionsMessageReceivedAction';
	message: SuggestionsRecipeAssessmentMessage;
}

export interface RecipeAssessmentErrorMessageReceivedAction extends Action {
	type: 'RecipeAssessmentErrorMessageReceivedAction';
	message: RecipeAssessmentErrorMessage;
}

export type MessageReceivedAction =
	| RecipeExtractionMessageReceivedAction
	| MoreThanOneRecipesAssessmentMessageReceivedAction
	| SuggestionsMessageReceivedAction
	| RecipeAssessmentErrorMessageReceivedAction;

export type MainAction =
	| PrepareToAssessRecipeAction
	| RecipeAssessmentFailedAction
	| RecipeAssessmentCompletedAction
	| ResetMainPageAction
	| RecipeExtractionMessageReceivedAction
	| MoreThanOneRecipesAssessmentMessageReceivedAction
	| SuggestionsMessageReceivedAction
	| RecipeAssessmentErrorMessageReceivedAction;

export function createPrepareToAssessRecipeAction(url: string): PrepareToAssessRecipeAction {
	return {
		type: 'PrepareToAssessRecipeAction',
		url,
	};
}

export function createRecipeAssessmentFailedAction(e: unknown): RecipeAssessmentFailedAction {
	let error: Error;
	if (e instanceof Error) {
		error = e;
	} else {
		error = new Error(e as string);
	}
	return {
		type: 'RecipeAssessmentFailedAction',
		error,
	};
}

export function createRecipeAssessmentCompletedAction(): RecipeAssessmentCompletedAction {
	return {
		type: 'RecipeAssessmentCompletedAction',
	};
}

export function createResetMainPageAction(): ResetMainPageAction {
	return {
		type: 'ResetMainPageAction',
	};
}

export function createMessageReceivedAction(message: RecipeAssessmentMessage): MessageReceivedAction {
	switch (message.type) {
		case 'RECIPES':
			return {
				type: 'RecipeExtractionMessageReceivedAction',
				message,
			};
		case 'SUGGESTIONS':
			return {
				type: 'SuggestionsMessageReceivedAction',
				message,
			};
		case 'ERROR':
			return {
				type: 'RecipeAssessmentErrorMessageReceivedAction',
				message,
			};
		case 'MORE_THAN_ONE_RECIPE':
			return {
				type: 'MoreThanOneRecipesAssessmentMessageReceivedAction',
				numberOfRecipes: message.numberOfRecipes,
			};
	}
}
