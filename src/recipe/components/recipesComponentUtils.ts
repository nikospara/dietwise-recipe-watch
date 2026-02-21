import type { RecipesComponentProps } from './RecipesComponent';

export const hasRecipesContent = (props: RecipesComponentProps): boolean => {
	return Boolean(props.recipes?.length || (props.errors?.length && !props.suggestions));
};
