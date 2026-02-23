import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { mainStateAtom } from 'recipe/atoms';
import { createSuggestionStatusAction } from 'recipe/actions';
import type { MainDataStatus, Recipe, RecipeDetectionType, SuggestionState } from 'recipe/model';
import { useTranslation } from 'react-i18next';
import RecipeComponent from './RecipeComponent';

export interface RecipesComponentProps {
	status: MainDataStatus;
	recipes: Recipe[] | undefined;
	detectionTypes: RecipeDetectionType[] | undefined;
	suggestions: { [key: string]: SuggestionState } | undefined;
	errors: string[] | undefined;
}

const RecipesComponent: React.FC = () => {
	const { t } = useTranslation();
	const [mainState, dispatch] = useAtom(mainStateAtom);
	const onMarkUndecided = useCallback(
		(arg: string) => dispatch(createSuggestionStatusAction(arg, 'UNDECIDED')),
		[dispatch],
	);

	if (mainState.recipes?.length) {
		return (
			<div className="recipes-pane">
				{mainState.recipes.map((r, index) => (
					<RecipeComponent
						key={r.name ?? `recipe-${index}`}
						index={index}
						recipe={r}
						detectionType={mainState.detectionTypes?.[index]}
						suggestions={mainState.suggestions}
						ingredientState={mainState.ingredientState}
						onMarkUndecided={onMarkUndecided}
					/>
				))}
			</div>
		);
	} else if (mainState.errors?.length && !mainState.suggestions) {
		return (
			<div className="recipes-pane error-pane">
				<h2>{t('recipe.encounteredErrors')}</h2>
				<ul>
					{mainState.errors.map((err, index) => (
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
