import { useCallback } from 'react';
import { Atom, useAtom } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { AuthActions } from 'ionic-appauth';
import { filter, switchMap, take } from 'rxjs';
import { buildAuthInstance } from './appAuthClient';
import { User } from './model';

const authInstance = buildAuthInstance();
const initializedAtom = atomWithObservable(() => authInstance.initComplete$);
const userAtom: Atom<User> = atomWithObservable(() => authInstance.user$);

// load the user if we have the credentials stored
authInstance.initComplete$
	.pipe(
		filter((complete) => complete),
		switchMap(() => authInstance.isAuthenticated$),
		take(1),
	)
	.subscribe({
		next(isAuthenticated) {
			if (isAuthenticated) authInstance.loadUserInfo();
		},
	});

export enum AuthOutcome {
	Success = 'Success',
	Failure = 'Failure',
}

export interface AuthResult {
	outcome: AuthOutcome;
}

export type UnsubscribeCallback = () => void;

export interface Auth {
	initialized: boolean;
	user: User | undefined;
	signIn: () => Promise<void>;
	signOut: () => Promise<void>;
	authorizationCallback: (
		callbackUrl: string,
		onSuccess: (result: AuthResult) => void,
		onFailure: (result: AuthResult) => void,
	) => UnsubscribeCallback;
	endSessionCallback: () => void;
}

export function useAuth(): Auth {
	const [initialized] = useAtom(initializedAtom);
	const [user] = useAtom(userAtom);

	// https://react.dev/reference/react/useCallback#optimizing-a-custom-hook
	const signIn = useCallback(() => authInstance.signIn(), []);
	const signOut = useCallback(() => authInstance.signOut(), []);

	// Why not just a function in the outer scope?
	// - Eventually we may need to use state data, so better have it inside the hook.
	const authorizationCallback = useCallback(
		(callbackUrl: string, onSuccess: (result: AuthResult) => void, onFailure: (result: AuthResult) => void) => {
			authInstance.authorizationCallback(callbackUrl);
			const subscription = authInstance.events$
				.pipe(
					filter(
						(action) =>
							action.action === AuthActions.SignInSuccess || action.action === AuthActions.SignInFailed,
					),
					take(1),
				)
				.subscribe({
					next(action) {
						if (action.action === AuthActions.SignInSuccess) {
							authInstance.loadUserInfo().then(() => {
								onSuccess({ outcome: AuthOutcome.Success });
							});
						} else {
							onFailure({ outcome: AuthOutcome.Failure });
						}
					},
					error() {
						onFailure({ outcome: AuthOutcome.Failure });
					},
					complete() {},
				});
			return () => subscription.unsubscribe();
		},
		[],
	);

	const endSessionCallback = useCallback(() => authInstance.endSessionCallback(), []);

	return {
		initialized,
		user,
		signIn,
		signOut,
		authorizationCallback,
		endSessionCallback,
	};
}
