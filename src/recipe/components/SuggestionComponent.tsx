import { useCallback } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { alertCircleOutline, checkmark, close } from 'ionicons/icons';
import type { Suggestion, SuggestionStatus } from '@/recipe/model';
import { isOutsideSeasonalityRange, makeCostString } from './suggestionsComponentUtils';

export interface SuggestionComponentProps {
	suggestion: Suggestion;
	status: SuggestionStatus | undefined;
	disabled?: boolean;
	onAction: (arg: SuggestionStatus) => void | Promise<void>;
}

const SuggestionComponent: React.FC<SuggestionComponentProps> = ({ suggestion, status, disabled, onAction }) => {
	const { t } = useTranslation();
	const acceptCallback = useCallback(() => onAction('ACCEPTED'), [onAction]);
	const rejectCallback = useCallback(() => onAction('REJECTED'), [onAction]);
	const showSeasonalityWarning = isOutsideSeasonalityRange(suggestion);

	const acceptButtonFill = status === 'ACCEPTED' ? 'solid' : 'outline';
	const rejectButtonFill = status === 'REJECTED' ? 'solid' : 'outline';

	return (
		<>
			<IonItem lines="none">
				<IonLabel>{suggestion.text}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>
					<p className="ion-display-flex ion-align-items-end gap-5px">
						{makeCostString(suggestion.cost)}
						{showSeasonalityWarning && (
							<>
								<IonIcon icon={alertCircleOutline}></IonIcon>
								{t('recipe.seasonalityWarning')}
							</>
						)}
					</p>
				</IonLabel>
				<IonButton
					slot="end"
					size="small"
					color="success"
					fill={acceptButtonFill}
					disabled={disabled}
					onClick={acceptCallback}
				>
					<IonIcon slot="icon-only" icon={checkmark}></IonIcon>
				</IonButton>
				<IonButton
					slot="end"
					size="small"
					color="warning"
					fill={rejectButtonFill}
					disabled={disabled}
					onClick={rejectCallback}
				>
					<IonIcon slot="icon-only" icon={close}></IonIcon>
				</IonButton>
			</IonItem>
		</>
	);
};

export default SuggestionComponent;
