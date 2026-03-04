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
	/** The id of the ingredient this suggestion applies to. */
	ingredient: string;
}

export interface AppliesToRecipe {
	type: 'RECIPE';
	/** The name of the recipe this suggestion applies to. */
	recipeName: string;
}

export interface SuggestionTemplate {
	alternative: string;
	restriction?: string;
	equivalence?: string;
	techniqueNotes?: string;
}

export interface Suggestion extends SuggestionTemplate {
	id: string;
	target: AppliesToIngredient | AppliesToRecipe;
	ruleId: string;
	recommendation: string;
	rationale?: string;
	text: string;
}

export interface SuggestionExtraData {
	ranking: number;
	totalAccepted: number;
	total: number;
}

export type SuggestionStatus = 'ACCEPTED' | 'REJECTED' | 'UNDECIDED';

export interface SuggestionState {
	suggestion: Suggestion;
	extra?: SuggestionExtraData;
	status: SuggestionStatus;
}

export interface Ingredient {
	id: string;
	nameInRecipe: string;
	triggerIngredient?: string;
	roleOrTechnique?: string;
}

export interface Recipe {
	name?: string;
	recipeYield?: string;
	recipeIngredients: Ingredient[];
	recipeInstructions: string[]; // TODO Must reference ingedient
	text?: string;
}

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

export type IngredientStateType = { [key: string]: string | undefined };

export interface MainData {
	status: MainDataStatus;
	errors?: string[];
	rating?: number;
	recipes?: Recipe[];
	detectionTypes?: RecipeDetectionType[];
	suggestionKeys?: string[];
	emptySuggestionsFromServer: boolean;
	/** Map from suggestion key to suggestion state. */
	suggestions?: { [key: string]: SuggestionState };
	/** Map from ingredient id to suggestion key, only if the substitution is accepted. */
	ingredientState?: IngredientStateType;
	/** The URL of the recipe page. */
	url?: string;
	/** The extracted content of the recipe page. */
	pageText?: string;
}

export function keyOfSuggestion(s: Suggestion): string {
	const targetId = s.target.type === 'INGREDIENT' ? 'I' + s.target.ingredient : 'R';
	return s.id + targetId;
}
