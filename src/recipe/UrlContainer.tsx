import { IonIcon, IonSpinner } from '@ionic/react';
import { alertCircle, checkmarkCircle } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import './UrlContainer.css';

export interface UrlContainerProps {
	onClick: () => void;
	url: string | undefined;
	status: 'INITIAL' | 'SUCCESS' | 'FAILURE' | 'PENDING';
}

const UrlContainer: React.FC<UrlContainerProps> = (props) => {
	const { t } = useTranslation();

	return (
		<p className="url-container ion-display-flex ion-align-items-center" onClick={props.onClick}>
			{typeof props.url === 'string' ? (
				<>
					{props.status === 'PENDING' ? <IonSpinner className="min-width-64px" /> : null}
					{props.status === 'SUCCESS' ? (
						<IonIcon icon={checkmarkCircle} color="success" size="large" className="min-width-64px" />
					) : null}
					{props.status === 'FAILURE' ? (
						<IonIcon icon={alertCircle} color="danger" size="large" className="min-width-64px" />
					) : null}
					<span>{props.url}</span>
				</>
			) : (
				<span className="enter-url-label">{t('recipe.enterUrl')}</span>
			)}
		</p>
	);
};

export default UrlContainer;
