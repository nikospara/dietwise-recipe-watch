import type { Recipe, SuggestionWithId } from 'recipe/model';

export interface HasSuggestionsArgument {
	recipes?: Recipe[];
	suggestions?: SuggestionWithId[];
	errors?: string[];
}

export const hasSuggestionsContent = (props: HasSuggestionsArgument): boolean => {
	return Boolean(props.suggestions?.length || (props.errors && props.recipes));
};
