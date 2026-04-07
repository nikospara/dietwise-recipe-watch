import { useCallback, useState } from 'react';
import { IonFab, IonFabButton, IonIcon, IonInput, IonItem, IonList, IonSelect, IonSelectOption } from '@ionic/react';
import { alert, checkmark } from 'ionicons/icons';
import type { InputInputEventDetail, SelectChangeEventDetail } from '@ionic/core';
import { useTranslation } from 'react-i18next';
import type { BiologicalGender, PersonalInfo, PersonalInfoValidity } from '@/personalization/model';

export interface PersonalizationFormProps {
	value: PersonalInfo;
	disabled: boolean;
	onSave: (value: PersonalInfo) => void;
	onValidationChange?: (v: PersonalInfoValidity) => void; // TODO
}

function makeErrors(errors: string[] | undefined): string {
	if (Array.isArray(errors)) {
		return errors.join(', ');
	} else {
		return '';
	}
}

const PersonalizationForm: React.FC<PersonalizationFormProps> = ({
	value: propsValue,
	disabled,
	onSave,
}: PersonalizationFormProps) => {
	const { t } = useTranslation();
	const [value, setValue] = useState(propsValue);
	const [validity, setValidity] = useState({ isValid: true } as PersonalInfoValidity);
	const onChangeGenderCallback = useCallback((e: CustomEvent<SelectChangeEventDetail<BiologicalGender>>) => {
		setValue((v) => ({ ...v, gender: e.detail.value }));
	}, []);
	const onChangeCountryCallback = useCallback((e: CustomEvent<SelectChangeEventDetail<string>>) => {
		setValue((v) => ({ ...v, country: e.detail.value }));
	}, []);
	const onChangeYearOfBirthCallback = useCallback(
		(e: CustomEvent<InputInputEventDetail>) => {
			if (typeof e.detail.value === 'string' && e.detail.value.length > 0) {
				const yearOfBirth = parseInt(e.detail.value);
				if (isNaN(yearOfBirth)) {
					setValidity((v) => ({
						...v,
						isValid: false,
						errors: { ...(v.errors || {}), yearOfBirth: [t('personalization.yearOfBirthIsNotANumber')] },
					}));
				} else if (yearOfBirth >= new Date().getFullYear()) {
					setValidity((v) => ({
						...v,
						isValid: false,
						errors: { ...(v.errors || {}), yearOfBirth: [t('personalization.yearOfBirthIsNotInThePast')] },
					}));
					setValue((v) => ({ ...v, yearOfBirth }));
				} else {
					setValidity({ isValid: true });
					setValue((v) => ({ ...v, yearOfBirth }));
				}
			} else {
				setValidity({ isValid: true });
				setValue((v) => ({ ...v, yearOfBirth: undefined }));
			}
		},
		[t],
	);
	const onSaveCallback = useCallback(() => {
		onSave(value);
	}, [onSave, value]);

	return (
		<>
			<IonList>
				<IonItem>
					<IonSelect
						label={t('personalization.gender')}
						cancelText={t('general.CANCEL')}
						okText={t('general.OK')}
						onIonChange={onChangeGenderCallback}
						value={value.gender}
						disabled={disabled}
					>
						<IonSelectOption value="FEMALE">{t('personalization.FEMALE')}</IonSelectOption>
						<IonSelectOption value="MALE">{t('personalization.MALE')}</IonSelectOption>
					</IonSelect>
				</IonItem>
				<IonItem>
					<IonInput
						label={t('personalization.yearOfBirth')}
						onIonInput={onChangeYearOfBirthCallback}
						value={value.yearOfBirth}
						disabled={disabled}
						type="number"
						className={`ion-text-right ion-touched${validity.errors?.yearOfBirth?.length && ' ion-invalid'}`}
						errorText={makeErrors(validity.errors?.yearOfBirth)}
					></IonInput>
				</IonItem>
				<IonItem>
					<IonSelect
						label={t('personalization.country')}
						cancelText={t('general.CANCEL')}
						okText={t('general.OK')}
						onIonChange={onChangeCountryCallback}
						value={value.country}
						disabled={disabled}
					>
						<IonSelectOption value="BE">{t('countries.BE')}</IonSelectOption>
						<IonSelectOption value="GR">{t('countries.GR')}</IonSelectOption>
						<IonSelectOption value="LT">{t('countries.LT')}</IonSelectOption>
					</IonSelect>
				</IonItem>
			</IonList>
			<IonFab slot="fixed" vertical="bottom" horizontal="end">
				<IonFabButton
					color={validity.isValid ? 'primary' : 'danger'}
					disabled={disabled || !validity.isValid}
					onClick={onSaveCallback}
				>
					<IonIcon icon={validity.isValid ? checkmark : alert}></IonIcon>
				</IonFabButton>
			</IonFab>
		</>
	);
};

export default PersonalizationForm;
