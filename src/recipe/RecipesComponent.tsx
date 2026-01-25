import type { Recipe, Suggestion } from 'recipe/model';
import { useTranslation } from 'react-i18next';
import RecipeComponent from './RecipeComponent';

export interface RecipesComponentProps {
	status: 'INITIAL' | 'SUCCESS' | 'FAILURE' | 'PENDING';
	recipes: Recipe[] | undefined;
	suggestions: Suggestion[] | undefined;
	errors: string[] | undefined;
}

const RecipesComponent: React.FC<RecipesComponentProps> = (props: RecipesComponentProps) => {
	const { t } = useTranslation();

	if (props.recipes?.length) {
		return (
			<div className="recipes-pane">
				{props.recipes.map((r, index) => (
					<RecipeComponent key={r.name ?? `recipe-${index}`} recipe={r} />
				))}
			</div>
		);
	} else if (props.errors?.length && !props.suggestions) {
		return (
			<div className="recipes-error-pane">
				<h2>{t('recipe.encounteredErrors')}</h2>
				<ul>
					{props.errors.map((err, index) => (
						<li key={index}>{err}</li>
					))}
				</ul>
			</div>
		);
	} else {
		return null;
	}
};

export default RecipesComponent;
