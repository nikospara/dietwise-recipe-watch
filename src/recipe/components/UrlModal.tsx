import { useCallback, useState } from 'react';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonItem,
	IonList,
	IonModal,
	IonTextarea,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import './UrlModal.css';

export interface UrlModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	url: string | undefined;
	setUrl: (url: string) => void;
}

const UrlModal: React.FC<UrlModalProps> = (props) => {
	const { t } = useTranslation();

	const [url, setUrl] = useState<string | null | undefined>(props.url);

	const assessCallback = useCallback(() => {
		let localUrl = url;
		if (localUrl && typeof localUrl === 'string') localUrl = localUrl.trim();
		if (localUrl && localUrl !== props.url) {
			props.setUrl('' + localUrl);
			props.setIsOpen(false);
		}
	}, [props, url]);

	return (
		<IonModal isOpen={props.isOpen} onDidDismiss={() => props.setIsOpen(false)}>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonButton onClick={() => props.setIsOpen(false)}>{t('general.CANCEL')}</IonButton>
					</IonButtons>
					<IonTitle>{t('recipe.enterUrlModalTitle')}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => assessCallback()}>{t('recipe.ASSESS')}</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonList>
					<IonItem>
						<IonTextarea
							autoGrow
							label={t('recipe.urlPlaceholder')}
							labelPlacement="stacked"
							value={url}
							onIonInput={(e) => setUrl(e.target.value)}
						>
							<IonButton
								fill="clear"
								slot="end"
								aria-label={t('general.clear')}
								onClick={() => setUrl(null)}
							>
								<IonIcon slot="icon-only" icon={close} aria-hidden="true"></IonIcon>
							</IonButton>
						</IonTextarea>
					</IonItem>
				</IonList>
			</IonContent>
		</IonModal>
	);
};

export default UrlModal;
