import { useIonViewDidEnter, IonPage } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { authService } from '@/auth/authService';

const EndSessionPage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
	useIonViewDidEnter(() => {
		authService.endSessionCallback();
		props.history.replace('/Home');
	});

	return (
		<IonPage>
			<p>Signing out...</p>
		</IonPage>
	);
};

export default EndSessionPage;
