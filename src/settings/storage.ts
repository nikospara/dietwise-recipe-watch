import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Settings, DEFAULT_SETTINGS } from './model';

const SETTINGS_KEY = 'recipewatch.settings';

export async function loadSettings(): Promise<Settings> {
	let result = DEFAULT_SETTINGS;
	try {
		const { value } = await SecureStoragePlugin.get({ key: SETTINGS_KEY });
		if (value) {
			result = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(value));
		}
	} catch (_e) {
		// fallback to default, already assigned
	}
	return result;
}

export async function saveSettings(settings: Settings): Promise<void> {
	return SecureStoragePlugin.set({ key: SETTINGS_KEY, value: JSON.stringify(settings) }).then(() => {});
}
