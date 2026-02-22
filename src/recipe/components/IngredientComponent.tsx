import { IonItem, IonLabel } from '@ionic/react';
import type { Ingredient, SuggestionState } from 'recipe/model';

export interface IngredientComponentProps {
	ingredient: Ingredient;
	acceptedSuggestion: SuggestionState | undefined;
}

export interface IngredientSuggestionProps {
	acceptedSuggestion: SuggestionState | undefined;
}

const IngredientSuggestion: React.FC<IngredientSuggestionProps> = ({ acceptedSuggestion }) => {
	const suggestion = acceptedSuggestion?.suggestion;
	return (
		<div>
			<span>{suggestion?.alternative}</span>
			{suggestion?.equivalence && (
				<div>
					<span className="text-bold">Equivalence:</span> {suggestion?.equivalence}
				</div>
			)}
			{suggestion?.techniqueNotes && (
				<div>
					<span className="text-bold">Notes:</span> {suggestion?.techniqueNotes}
				</div>
			)}
		</div>
	);
};

const IngredientComponent: React.FC<IngredientComponentProps> = ({ ingredient, acceptedSuggestion }) => {
	const originalIngredientClassName = acceptedSuggestion ? 'text-strikethrough color-medium' : '';
	return (
		<IonItem key={ingredient.id}>
			<IonLabel>
				<div className={originalIngredientClassName}>{ingredient.nameInRecipe}</div>
				{acceptedSuggestion && <IngredientSuggestion acceptedSuggestion={acceptedSuggestion} />}
			</IonLabel>
		</IonItem>
	);
};

export default IngredientComponent;
