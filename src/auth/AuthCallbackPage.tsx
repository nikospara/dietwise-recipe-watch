import { useRef, RefObject } from 'react';
import { useIonViewDidEnter, useIonViewWillLeave, IonPage } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { authService } from '@/auth/authService';
import { filter, from, Subscription, switchMap, take, throwError } from 'rxjs';
import { AuthActions } from 'ionic-appauth';

const LOG_SENSITIVE_DATA = import.meta.env.DEV;

const AuthCallbackPage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
	const unsubscribeRef: RefObject<Subscription | null> = useRef(null);

	useIonViewDidEnter(() => {
		const callbackUrl = window.location.origin + props.location.pathname + props.location.search;
		authService.authorizationCallback(callbackUrl);
		unsubscribeRef.current = authService.events$
			.pipe(
				filter(
					(action) =>
						action.action === AuthActions.SignInSuccess || action.action === AuthActions.SignInFailed,
				),
				take(1),
				switchMap((action) => {
					if (action.action === AuthActions.SignInSuccess) {
						return from(authService.loadUserInfo());
					} else {
						return throwError(() => action.error);
					}
				}),
			)
			.subscribe({
				next() {
					props.history.replace('/Home');
				},
				error(err) {
					if (LOG_SENSITIVE_DATA) {
						console.error('Sign in failed', err);
					}
					props.history.replace('/Home');
				},
			});
	});

	useIonViewWillLeave(() => unsubscribeRef.current?.unsubscribe());

	return (
		<IonPage>
			<p>Signing in...</p>
		</IonPage>
	);
};

export default AuthCallbackPage;
