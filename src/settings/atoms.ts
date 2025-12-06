import { atom } from 'jotai';
import i18next from 'i18next';
import { saveSettings } from 'settings/storage';
import type { Settings } from './model';

export const settingsAtom = atom({} as Settings, async (_get, set, value: Settings) => {
	await saveSettings(value);
	set(settingsAtom, value);
});

export const languageAtom = atom(
	(get) => get(settingsAtom).language,
	async (get, set, language: string) => {
		await set(settingsAtom, { ...get(settingsAtom), language });
		await i18next.changeLanguage(language);
	},
);
