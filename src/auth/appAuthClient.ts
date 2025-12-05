import { isPlatform } from '@ionic/react';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { AuthService } from 'ionic-appauth';
import { CapacitorBrowser, CapacitorSecureStorage } from 'ionic-appauth/lib/capacitor';
import { RequestorImpl } from 'services/RequestorImpl';

export function buildAuthInstance(): AuthService {
	const requestor = new RequestorImpl();
	const authService = new AuthService(new CapacitorBrowser(), new CapacitorSecureStorage(), requestor);
	authService.authConfig = {
		client_id: 'recipewatch',
		// TODO Configuration!
		server_host: 'http://localhost:8280/realms/dietwise/',
		redirect_url: isPlatform('capacitor')
			? 'com.appauth.demo://callback'
			: window.location.origin + '/authcallback',
		end_session_redirect_url: isPlatform('capacitor')
			? 'com.appauth.demo://endSession'
			: window.location.origin + '/endsession',
		scopes: 'openid offline_access',
		pkce: true,
	};
	if (isPlatform('capacitor')) {
		App.addListener('appUrlOpen', (data: URLOpenListenerEvent) => {
			if (data.url.indexOf(authService.authConfig.redirect_url) === 0) {
				authService.authorizationCallback(data.url);
			} else {
				authService.endSessionCallback();
			}
		});
	}
	authService.init();
	return authService;
}
