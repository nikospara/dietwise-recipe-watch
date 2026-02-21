import { IonIcon } from '@ionic/react';
import { addIcons } from 'ionicons';
import { useTranslation } from 'react-i18next';
import type { Recipe, RecipeDetectionType } from 'recipe/model';
import brainIcon from '@/assets/images/brain.svg';
import jsonLdIcon from '@/assets/images/json-ld.svg';

addIcons({
	brain: brainIcon,
	jsonld: jsonLdIcon,
});

export interface RecipeComponentProps {
	index: number;
	recipe: Recipe;
	detectionType: RecipeDetectionType | undefined;
}

const RecipeComponent: React.FC<RecipeComponentProps> = (props: RecipeComponentProps) => {
	const { t } = useTranslation();

	return (
		<section>
			<h2 className="ion-display-flex ion-align-items-center ion-justify-content-between">
				{props.recipe.name
					? props.recipe.name
					: t('recipe.anonymousRecipeTemplateTitle', { index: props.index + 1 })}
				{props.detectionType ? (
					<IonIcon
						icon={props.detectionType === 'JSONLD' ? 'jsonld' : 'brain'}
						aria-hidden="true"
						color="lightmedium"
						size="large"
					/>
				) : null}
			</h2>
			{props.recipe.recipeIngredients?.length > 0 ? (
				<>
					<h3>Ingredients</h3>
					<ul>
						{props.recipe.recipeIngredients.map((ingredient) => (
							<li key={ingredient.id}>{ingredient.nameInRecipe}</li>
						))}
					</ul>
				</>
			) : props.recipe.text ? (
				<pre className="text-pre-wrap">{props.recipe.text}</pre>
			) : null}
		</section>
	);
	// TODO We could have an accordeon or something similar to display the entire, pristine recipe
	// TODO Maybe this would give the user the opportunity to edit it
	// TODO After editing, allow reset or re-assess
};

export default RecipeComponent;
