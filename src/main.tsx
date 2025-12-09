import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadSettings } from 'settings/storage';
import { configureI18n } from './i18n';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { settingsAtom } from 'settings/atoms';
import { authService, configureServerHost } from 'auth/authService';

async function bootstrap() {
	// configure the application before launching the UI
	const initialSettings = await loadSettings();
	configureServerHost(initialSettings.serverHost);
	const [_t, _l] = await Promise.all([
		configureI18n(initialSettings.language), // returns t, if we ever want to use it here
		authService.init().catch((reason) => {
			console.log('authService initialization failed', reason);
			throw reason;
		}),
	]);
	try {
		await authService.loadTokenFromStorage();
	} catch (reason) {
		console.warn('Load token from storage failed', reason);
	}
	const jotaiStore = createStore();
	jotaiStore.set(settingsAtom, initialSettings);
	// launch the UI, remember to keep the JotaiProvider outside of React.StrictMode
	const container = document.getElementById('root');
	const root = createRoot(container!);
	root.render(
		<JotaiProvider store={jotaiStore}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</JotaiProvider>,
	);
}

bootstrap();
