export interface Viewport {
	width: number;
	height: number;
}

export interface RecipeExtractionAndAssessmentParam {
	/** The URL of the page containing the recipe to assess. */
	url: string;
	/** The viewport in the client. */
	viewport?: Viewport;
	/** The language of the page. */
	langCode: string;
}

export interface AppliesToIngredient {
	type: 'INGREDIENT';
	/** The name of the ingredient this suggestion applies to. */
	ingredient: string;
	// TODO must also reference recipe
}

export interface AppliesToRecipe {
	type: 'RECIPE';
	/** The name of the recipe this suggestion applies to. */
	recipe: string;
}

export interface Suggestion {
	text: string;
	appliesTo: AppliesToIngredient | AppliesToRecipe;
}

export interface Recipe {
	name?: string;
	recipeYield?: string;
	recipeIngredients: string[];
	recipeInstructions: string[]; // TODO Must reference ingedient
	text?: string;
}

// TODO Model altered ingredients

export type RecipeDetectionType = 'JSONLD' | 'LLM_FROM_TEXT';

export interface RecipeAndDetectionType {
	recipe: Recipe;
	detectionType: RecipeDetectionType;
}

export interface RecipeExtractionRecipeAssessmentMessage {
	type: 'RECIPES';
	recipes: RecipeAndDetectionType[];
	pageText: string;
}

export interface MoreThanOneRecipesAssessmentMessage {
	type: 'MORE_THAN_ONE_RECIPE';
	numberOfRecipes: number;
}

export interface SuggestionsRecipeAssessmentMessage {
	type: 'SUGGESTIONS';
	suggestions?: Suggestion[];
	rating?: number;
}

export interface RecipeAssessmentErrorMessage {
	type: 'ERROR';
	errors?: string[];
}

export type RecipeAssessmentMessage =
	| RecipeExtractionRecipeAssessmentMessage
	| MoreThanOneRecipesAssessmentMessage
	| SuggestionsRecipeAssessmentMessage
	| RecipeAssessmentErrorMessage;

export type MainDataStatus = 'INITIAL' | 'SUCCESS' | 'FAILURE' | 'PENDING' | 'SELECT_RECIPE';

export interface MainData {
	status: MainDataStatus;
	errors?: string[];
	rating?: number;
	recipes?: Recipe[];
	detectionTypes?: RecipeDetectionType[];
	suggestions?: Suggestion[];
	/** The URL of the recipe page. */
	url?: string;
	/** The extracted content of the recipe page. */
	pageText?: string;
}
