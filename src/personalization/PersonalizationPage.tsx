import { useCallback } from 'react';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonPage,
	IonSpinner,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useAtom, useSetAtom } from 'jotai';
import {
	loadablePersonalInfoAtom,
	personalInfoAtom,
	personalInfoSaveStateAtom,
	savePersonalInfoAtom,
} from 'personalization/atoms';
import type { PersonalInfo } from 'personalization/model';
import PersonalizationForm from 'personalization/PersonalizationForm';

const PersonalizationPage: React.FC = () => {
	const { t } = useTranslation();
	const [personalInfo] = useAtom(loadablePersonalInfoAtom);
	const [saveState] = useAtom(personalInfoSaveStateAtom);
	const refreshPersonalInfoAtom = useSetAtom(personalInfoAtom);
	const setPersonalInfoAtom = useSetAtom(savePersonalInfoAtom);
	const onSaveCallback = useCallback(
		async (value: PersonalInfo) => {
			console.log('Will save personal info', value);
			try {
				await setPersonalInfoAtom(value);
			} catch (e) {
				console.error('Error saving personal info', e);
			}
		},
		[setPersonalInfoAtom],
	);
	const onRetryCallback = useCallback(() => {
		refreshPersonalInfoAtom();
	}, [refreshPersonalInfoAtom]);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{t('personalization.title')}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{/* Reminder, the inner, collapse=condense header is for iOS: https://ionicframework.com/docs/api/header#condensed-header */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{t('personalization.title')}</IonTitle>
					</IonToolbar>
				</IonHeader>

				{personalInfo.state === 'loading' && <IonSpinner></IonSpinner>}
				{personalInfo.state === 'hasError' && (
					<p className="ion-padding">
						An error occured!
						<br />
						<IonButton onClick={onRetryCallback}>Retry</IonButton>
					</p>
				)}
				{personalInfo.state === 'hasData' && (
					<>
						<PersonalizationForm
							value={personalInfo.data}
							disabled={saveState.status === 'saving'}
							onSave={onSaveCallback}
						/>
						{saveState.status === 'error' && (
							<p className="ion-padding-start ion-padding-end ion-text-danger">
								{saveState.errorMessage}
							</p>
						)}
					</>
				)}
			</IonContent>
		</IonPage>
	);
};

export default PersonalizationPage;
