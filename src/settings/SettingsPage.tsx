import { useCallback, useState } from 'react';
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonMenuButton,
	IonPage,
	IonSelect,
	IonSelectOption,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { SelectChangeEventDetail } from '@ionic/core';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { languageAtom } from 'settings/atoms';

const SettingsPage: React.FC = () => {
	const { t } = useTranslation();
	const [language, setLanguage] = useAtom(languageAtom);
	// XXX By keeping state here we may be forcing the entire component to rerender. This may not be so bad if there is only the language setting. If we have more, refactor.
	const [settingLanguage, setSettingLanguage] = useState(false);
	const onChangeLanguageCallback = useCallback(
		async (e: CustomEvent<SelectChangeEventDetail<string>>) => {
			const newLanguage = e.detail.value;
			setSettingLanguage(true);
			await setLanguage(newLanguage);
			setSettingLanguage(false);
		},
		[setLanguage],
	);

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{t('settings.title')}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{/* Reminder, the inner, collapse=condense header is for iOS: https://ionicframework.com/docs/api/header#condensed-header */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{t('settings.title')}</IonTitle>
					</IonToolbar>
				</IonHeader>

				<IonList>
					<IonItem>
						<IonLabel>{t('settings.language')}</IonLabel>
						<IonSelect
							cancelText={t('general.CANCEL')}
							okText={t('general.OK')}
							onIonChange={onChangeLanguageCallback}
							value={language}
							disabled={settingLanguage}
						>
							<IonSelectOption value="en">English</IonSelectOption>
							<IonSelectOption value="el">Ελληνικά</IonSelectOption>
						</IonSelect>
					</IonItem>
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default SettingsPage;
