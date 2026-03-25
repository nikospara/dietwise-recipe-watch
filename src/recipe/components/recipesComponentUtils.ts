import type { Recipe } from '@/recipe/model';

export interface HasRecipesArgument {
	recipes?: Recipe[];
	suggestionIds?: string[];
	errors?: string[];
}

export const hasRecipesContent = (props: HasRecipesArgument): boolean => {
	return Boolean(props.recipes?.length || (props.errors?.length && !props.suggestionIds));
};
