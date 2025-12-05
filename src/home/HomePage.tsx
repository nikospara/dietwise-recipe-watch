import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useTranslation } from 'react-i18next';
// import { useAuth } from 'auth/useAuth';

const HomePage: React.FC = () => {
	const { t } = useTranslation();
	// const { user } = useAuth();

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
				{

				}
			</IonContent>
		</IonPage>
	);
};

export default HomePage;
