export interface Settings {
	language: string;
}

export const DEFAULT_SETTINGS: Settings = Object.freeze({
	language: 'en',
});
