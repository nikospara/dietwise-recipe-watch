import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadSettings } from 'settings/storage';
import { configureI18n } from './i18n';

const initialSettings = await loadSettings();

Promise.all([configureI18n(initialSettings.language)]).then(([_t]) => {
	const container = document.getElementById('root');
	const root = createRoot(container!);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>,
	);
});
