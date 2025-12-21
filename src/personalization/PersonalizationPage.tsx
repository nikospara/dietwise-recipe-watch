import { useCallback, useState } from 'react';
import {
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
import { loadablePersonalInfoAtom, personalInfoAtom } from 'personalization/atoms';
import type { PersonalInfo } from 'personalization/model';
import PersonalizationForm from 'personalization/PersonalizationForm';

const PersonalizationPage: React.FC = () => {
	const { t } = useTranslation();
	const [saving, setSaving] = useState(false);
	const [personalInfo] = useAtom(loadablePersonalInfoAtom);
	const setPersonalInfoAtom = useSetAtom(personalInfoAtom);
	const onSaveCallback = useCallback(
		async (value: PersonalInfo) => {
			console.log('Will save personal info', value);
			setSaving(true);
			try {
				await setPersonalInfoAtom(value);
			} catch (e) {
				console.error('Error saving personal info', e);
			}
			setSaving(false);
		},
		[setPersonalInfoAtom],
	);

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
				{personalInfo.state === 'hasError' && /* TODO IonToast, retry button */ <div>Error!</div>}
				{personalInfo.state === 'hasData' && (
					<PersonalizationForm value={personalInfo.data} disabled={saving} onSave={onSaveCallback} />
				)}
			</IonContent>
		</IonPage>
	);
};

export default PersonalizationPage;
