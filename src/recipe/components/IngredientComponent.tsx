// import { useCallback } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { removeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import type { Ingredient, SuggestionState } from 'recipe/model';

export interface IngredientComponentProps {
	ingredient: Ingredient;
	acceptedSuggestion: SuggestionState | undefined;
	onMarkUndecided: (arg: string) => void;
}

export interface IngredientSuggestionProps {
	acceptedSuggestion: SuggestionState | undefined;
}

const IngredientSuggestion: React.FC<IngredientSuggestionProps> = ({ acceptedSuggestion }) => {
	const { t } = useTranslation();
	const suggestion = acceptedSuggestion?.suggestion;
	return (
		<div>
			<span>{suggestion?.alternative}</span>
			{suggestion?.equivalence && (
				<div>
					<span className="text-bold">{t('ingredient.equivalence')}</span> {suggestion?.equivalence}
				</div>
			)}
			{suggestion?.techniqueNotes && (
				<div>
					<span className="text-bold">{t('ingredient.techniqueNotes')}</span> {suggestion?.techniqueNotes}
				</div>
			)}
		</div>
	);
};

const IngredientComponent: React.FC<IngredientComponentProps> = ({
	ingredient,
	acceptedSuggestion,
	onMarkUndecided,
}) => {
	const originalIngredientClassName = acceptedSuggestion ? 'text-strikethrough color-medium' : '';
	return (
		<IonItem key={ingredient.id}>
			<IonLabel>
				<div className={originalIngredientClassName}>{ingredient.nameInRecipe}</div>
				{acceptedSuggestion && <IngredientSuggestion acceptedSuggestion={acceptedSuggestion} />}
			</IonLabel>
			{acceptedSuggestion && (
				<IonButton
					slot="end"
					size="default"
					shape="round"
					color="dark"
					fill="outline"
					onClick={() => onMarkUndecided(acceptedSuggestion?.suggestion.id)}
				>
					<IonIcon slot="icon-only" icon={removeOutline}></IonIcon>
				</IonButton>
			)}
		</IonItem>
	);
};

export default IngredientComponent;
