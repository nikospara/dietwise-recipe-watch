import type { Recipe, Suggestion } from 'recipe/model';
import { useTranslation } from 'react-i18next';
import RecipeComponent from './RecipeComponent';
import type { MainDataStatus, RecipeDetectionType } from '../model';

export interface RecipesComponentProps {
	status: MainDataStatus;
	recipes: Recipe[] | undefined;
	detectionTypes: RecipeDetectionType[] | undefined;
	suggestions: Suggestion[] | undefined;
	errors: string[] | undefined;
}

const RecipesComponent: React.FC<RecipesComponentProps> = (props: RecipesComponentProps) => {
	const { t } = useTranslation();

	if (props.recipes?.length) {
		return (
			<div className="recipes-pane">
				{props.recipes.map((r, index) => (
					<RecipeComponent
						key={r.name ?? `recipe-${index}`}
						index={index}
						recipe={r}
						detectionType={props.detectionTypes?.[index]}
					/>
				))}
			</div>
		);
	} else if (props.errors?.length && !props.suggestions) {
		return (
			<div className="recipes-pane error-pane">
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
