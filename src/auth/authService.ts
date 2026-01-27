import { isPlatform } from '@ionic/react';
import { AuthService } from 'ionic-appauth';
import { CapacitorBrowser, CapacitorSecureStorage } from 'ionic-appauth/lib/capacitor';
import { RequestorImpl } from 'services/RequestorImpl';
import { App, URLOpenListenerEvent } from '@capacitor/app';

export const authService = new AuthService(new CapacitorBrowser(), new CapacitorSecureStorage(), new RequestorImpl());

// Configure the service (snake_case keys!)
authService.authConfig = {
	client_id: 'recipewatch',
	server_host: 'http://localhost:8280/realms/dietwise', // TODO Revisit
	redirect_url: isPlatform('capacitor')
		? 'capacitor://localhost/authcallback' // or is it 'eu.dietwise.recipewatch://authcallback'?
		: window.location.origin + '/authcallback',
	end_session_redirect_url: isPlatform('capacitor')
		? 'capacitor://localhost/endsession' // or is it 'eu.dietwise.recipewatch://endsession'
		: window.location.origin + '/endsession',
	scopes: 'openid profile email offline_access',
	pkce: false, // TODO true when fully operational
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

export function configureServerHost(serverHost: string) {
	authService.authConfig.server_host = serverHost;
}

export async function getValidAccessToken(): Promise<string | undefined> {
	try {
		const tokenResponse = await authService.getValidToken(0);
		return tokenResponse?.accessToken;
	} catch (err) {
		// TODO Check HTTP response/whatever for expired refresh token and prompt to login again
		console.error('Unable to obtain valid access token', err);
		return undefined;
	}
}
