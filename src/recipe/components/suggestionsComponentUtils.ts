import type { Recipe } from 'recipe/model';

export interface HasSuggestionsArgument {
	recipes?: Recipe[];
	suggestionKeys?: string[];
	errors?: string[];
}

export const hasSuggestionsContent = (props: HasSuggestionsArgument): boolean => {
	return Boolean(props.suggestionKeys?.length || (props.errors && props.recipes));
};
