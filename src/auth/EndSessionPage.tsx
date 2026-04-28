import { useIonViewDidEnter, IonPage } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { authService } from '@/auth/authService';
import { consumeMobilePreviewReturnPath } from '@/auth/mobilePreviewAuth';

const EndSessionPage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
	useIonViewDidEnter(() => {
		authService.endSessionCallback();
		const mobilePreviewReturnPath = consumeMobilePreviewReturnPath();
		if (mobilePreviewReturnPath) {
			window.location.replace(mobilePreviewReturnPath);
			return;
		}
		props.history.replace('/Home');
	});

	return (
		<IonPage>
			<p>Signing out...</p>
		</IonPage>
	);
};

export default EndSessionPage;
