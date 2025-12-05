import { useIonViewDidEnter, IonPage } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { useAuth } from './useAuth';

const EndSessionPage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
	const { endSessionCallback } = useAuth();

	useIonViewDidEnter(() => {
		endSessionCallback();
		props.history.replace('/Home');
	});

	return (
		<IonPage>
			<p>Signing out...</p>
		</IonPage>
	);
};

export default EndSessionPage;
