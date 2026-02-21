import { useCallback } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import type { Suggestion, SuggestionStatus } from 'recipe/model';

export interface SuggestionComponentProps {
	suggestion: Suggestion;
	status: SuggestionStatus | undefined;
	onAction: (arg: SuggestionStatus) => void;
}

const SuggestionComponent: React.FC<SuggestionComponentProps> = ({ suggestion, status, onAction }) => {
	const acceptCallback = useCallback(() => onAction('ACCEPTED'), [onAction]);
	const rejectCallback = useCallback(() => onAction('REJECTED'), [onAction]);

	const acceptButtonFill = status === 'ACCEPTED' ? 'solid' : 'outline';
	const rejectButtonFill = status === 'REJECTED' ? 'solid' : 'outline';

	return (
		<IonItem>
			<IonLabel>{suggestion.text}</IonLabel>
			<IonButton slot="end" size="default" color="success" fill={acceptButtonFill} onClick={acceptCallback}>
				<IonIcon slot="icon-only" icon={checkmark}></IonIcon>
			</IonButton>
			<IonButton slot="end" size="default" color="warning" fill={rejectButtonFill} onClick={rejectCallback}>
				<IonIcon slot="icon-only" icon={close}></IonIcon>
			</IonButton>
		</IonItem>
	);
};

export default SuggestionComponent;
