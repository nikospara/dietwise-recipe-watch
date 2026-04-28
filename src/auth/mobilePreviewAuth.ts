import { Browser } from 'ionic-appauth';

/*
The problem in production is that ionic-appauth was opening the IDM URL with _self, and inside the preview _self means
the iframe. Chrome then blocks the IDM page because it is not allowed to be framed.

Changes:

- Added src/auth/mobilePreviewAuth.ts with a web browser adapter that opens auth/logout in the top-level window when
  framed.
- Updated src/auth/authService.ts to keep Capacitor behavior native, but use the preview-aware browser on the web.
- Updated src/auth/AuthCallbackPage.tsx and src/auth/EndSessionPage.tsx so after login/logout completes, the browser
  returns to /mobile-preview and reloads the app inside the phone iframe.
*/

const MOBILE_PREVIEW_RETURN_KEY = 'recipewatch.mobilePreviewReturnPath';

const basePath = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
const mobilePreviewPath = `${basePath}/mobile-preview`;

function isRunningInFrame(): boolean {
	try {
		return window.self !== window.top;
	} catch (_e) {
		return true;
	}
}

function getCurrentTopLevelPath(): string {
	try {
		if (window.top?.location.origin === window.location.origin) {
			return `${window.top.location.pathname}${window.top.location.search}${window.top.location.hash}`;
		}
	} catch (_e) {
		// Ignore cross-origin frame access errors and fall back to the default preview path.
	}
	return mobilePreviewPath;
}

function isMobilePreviewReturnPath(returnPath: string): boolean {
	return (
		returnPath === mobilePreviewPath ||
		returnPath.startsWith(`${mobilePreviewPath}?`) ||
		returnPath.startsWith(`${mobilePreviewPath}#`)
	);
}

function rememberMobilePreviewReturnPath() {
	if (!isRunningInFrame()) {
		return;
	}
	sessionStorage.setItem(MOBILE_PREVIEW_RETURN_KEY, getCurrentTopLevelPath());
}

export function consumeMobilePreviewReturnPath(): string | undefined {
	const returnPath = sessionStorage.getItem(MOBILE_PREVIEW_RETURN_KEY);
	if (!returnPath) {
		return undefined;
	}
	sessionStorage.removeItem(MOBILE_PREVIEW_RETURN_KEY);
	if (!isMobilePreviewReturnPath(returnPath)) {
		return undefined;
	}
	return returnPath;
}

export class MobilePreviewAwareBrowser extends Browser {
	showWindow(url: string): string | undefined {
		if (isRunningInFrame()) {
			rememberMobilePreviewReturnPath();
			window.open(url, '_top');
			return undefined;
		}
		window.open(url, '_self');
		return undefined;
	}

	closeWindow(): void {
		// Web redirects do not open a separate browser window that should be closed.
	}
}
