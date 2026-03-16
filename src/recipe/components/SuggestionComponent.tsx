import { useCallback } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { checkmark, close } from 'ionicons/icons';
import type { Suggestion, SuggestionStatus, SuggestionStats } from 'recipe/model';

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

	const acceptButtonFill = status === 'ACCEPTED' ? 'solid' : 'outline';
	const rejectButtonFill = status === 'REJECTED' ? 'solid' : 'outline';

	return (
		<>
			<IonItem lines="none">
				<IonLabel>{suggestion.text}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>
					<p>
						{t('recipe.userStats')} {formatStats(suggestion.userSuggestionStats, status)}{' '}
						{t('recipe.totalStats')} {formatStats(suggestion.totalSuggestionStats, status)}
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

function formatStats(stats: SuggestionStats, status: SuggestionStatus | undefined) {
	const timesAccepted =
		status === 'ACCEPTED' && stats.timesAccepted + stats.timesRejected < stats.timesSuggested
			? stats.timesAccepted + 1
			: stats.timesAccepted;
	const timesRejected =
		status === 'REJECTED' && stats.timesAccepted + stats.timesRejected < stats.timesSuggested
			? stats.timesRejected + 1
			: stats.timesRejected;
	return `${timesAccepted}/${timesRejected}/${stats.timesSuggested}`;
}

export default SuggestionComponent;
