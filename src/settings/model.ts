export interface Settings {
	language: string;
	serverHost: string;
}

export const DEFAULT_SETTINGS: Settings = Object.freeze({
	language: 'en',
	serverHost: 'http://localhost:8280/realms/dietwise', // TODO Revisit
});
