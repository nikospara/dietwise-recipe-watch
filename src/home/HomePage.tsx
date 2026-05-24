import { useState } from 'react';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/auth/atoms';
import TermsModal from '@/home/TermsModal';

const HomePage: React.FC = () => {
	const { t } = useTranslation();
	const user = useAtomValue(userAtom);
	const [isTermsOpen, setIsTermsOpen] = useState(false);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{t('home.title')}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{/* Reminder, the inner, collapse=condense header is for iOS: https://ionicframework.com/docs/api/header#condensed-header */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{t('home.title')}</IonTitle>
					</IonToolbar>
				</IonHeader>
				<div className="help ion-padding-horizontal">
					<h1>{t('home.heading')}</h1>
					<p className="moto">{t('home.moto')}</p>
					<p>{t('home.paragraph1')}</p>
					{user ? null : (
						<>
							<p>{t('home.registration.start')}</p>
							<ul>
								<li>{t('home.registration.step1')}</li>
								<li>{t('home.registration.step2')}</li>
								<li>{t('home.registration.step3')}</li>
							</ul>
						</>
					)}
					<p className="ion-text-center">
						<IonButton fill="clear" size="small" onClick={() => setIsTermsOpen(true)}>
							{t('terms.openButton')}
						</IonButton>
					</p>
				</div>

				<TermsModal isOpen={isTermsOpen} setIsOpen={setIsTermsOpen} />
			</IonContent>
		</IonPage>
	);
};

export default HomePage;
