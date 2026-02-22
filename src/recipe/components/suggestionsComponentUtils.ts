import type { Recipe } from 'recipe/model';

export interface HasSuggestionsArgument {
	recipes?: Recipe[];
	suggestionIds?: string[];
	errors?: string[];
}

export const hasSuggestionsContent = (props: HasSuggestionsArgument): boolean => {
	return Boolean(props.suggestionIds?.length || (props.errors && props.recipes));
};
