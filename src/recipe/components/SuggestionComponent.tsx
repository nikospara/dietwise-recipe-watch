import { useCallback } from 'react';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import type { Suggestion, SuggestionStatus } from 'recipe/model';

export interface SuggestionComponentProps {
	suggestion: Suggestion;
	status: SuggestionStatus | undefined;
	disabled?: boolean;
	onAction: (arg: SuggestionStatus) => void | Promise<void>;
}

const SuggestionComponent: React.FC<SuggestionComponentProps> = ({ suggestion, status, disabled, onAction }) => {
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
