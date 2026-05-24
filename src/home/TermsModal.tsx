import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import TermsContent from '@/home/TermsContent';

export interface TermsModalProps {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, setIsOpen }) => {
	const { t } = useTranslation();

	return (
		<IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
			<IonHeader>
				<IonToolbar>
					<IonTitle>{t('terms.title')}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={() => setIsOpen(false)}>{t('general.OK')}</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<TermsContent />
			</IonContent>
		</IonModal>
	);
};

export default TermsModal;
