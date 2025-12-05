import { useRef, RefObject } from 'react';
import { useIonViewDidEnter, useIonViewWillLeave, IonPage } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { useAuth, UnsubscribeCallback } from './useAuth';

const AuthCallbackPage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
	const { authorizationCallback } = useAuth();
	const unsubscribeRef: RefObject<UnsubscribeCallback | null> = useRef(null);

	useIonViewDidEnter(() => {
		const url = window.location.origin + props.location.pathname + props.location.search;
		unsubscribeRef.current = authorizationCallback(
			url,
			() => props.history.replace('/Home'),
			() => props.history.replace('/Home'),
		);
	});

	useIonViewWillLeave(() => unsubscribeRef.current?.());

	return (
		<IonPage>
			<p>Signing in...</p>
		</IonPage>
	);
};

export default AuthCallbackPage;
