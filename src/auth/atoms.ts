import type { Atom } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { catchError, filter, from, map, switchMap } from 'rxjs';
import { AuthActions } from 'ionic-appauth';
import { authService } from 'auth/authService';
import type { User } from './model';

authService.events$.subscribe({
	next(action) {
		console.log('AUTH EVENT', action);
	},
	error(err) {
		console.error('AUTH ERROR', err);
	},
});

export const accessTokenAtom = atomWithObservable(() =>
	authService.events$.pipe(
		filter(
			(action) =>
				action.action === AuthActions.LoadTokenFromStorageSuccess ||
				action.action === AuthActions.RefreshSuccess,
		),
		map((action) => action.tokenResponse?.accessToken),
	),
);

export const refreshTokenAtom = atomWithObservable(() =>
	authService.events$.pipe(
		filter(
			(action) =>
				action.action === AuthActions.LoadTokenFromStorageSuccess ||
				action.action === AuthActions.RefreshSuccess,
		),
		map((action) => action.tokenResponse?.refreshToken),
	),
);

authService.events$
	.pipe(
		filter((action) => action.action === AuthActions.LoadTokenFromStorageSuccess),
		switchMap(() => from(authService.loadUserInfo())),
		map(() => ['SUCCESS', null]),
		catchError((err) => ['FAILURE', err]),
	)
	.subscribe({
		next([outcome, err]) {
			if (err) {
				// The err signals a system error; if the app simply fails to load user info,
				// e.g. due to token expired, we succeed above, and we only get the relevant
				// message in the authService.events$ stream.
				console.log('Load user info after loading the token from storage: ', outcome, err);
			}
		},
	});

export const userAtom: Atom<User> = atomWithObservable(() => authService.user$);
