import { useTranslation } from 'react-i18next';
import { IonIcon } from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import './HelpContentsComponent.css';

const HelpContentsComponent: React.FC = () => {
	const { t } = useTranslation();
	return (
		<div className="help ion-padding-horizontal">
			<p>{t('recipe.help.paragraph1')}</p>
			<p>{t('recipe.help.paragraph2')}</p>
			<p>{t('recipe.help.paragraph3')}</p>
			<ol>
				<li className="ion-margin-vertical">{t('recipe.help.explainUndecidedButton')}</li>
				<li className="ion-margin-vertical">
					<span className="ion-display-inline-flex ion-align-items-center gap-10px">
						<span>{t('recipe.help.explainApproveButton')}</span>
						<span className="sim-button sim-button-success">
							<IonIcon icon={checkmark} color="success" />
						</span>
					</span>
				</li>
				<li className="ion-margin-vertical">
					<span className="ion-display-inline-flex ion-align-items-center gap-10px">
						<span>{t('recipe.help.explainRejectButton')}</span>
						<span className="sim-button sim-button-warn">
							<IonIcon icon={close} color="warning" />
						</span>
					</span>
				</li>
			</ol>
			<p>{t('recipe.help.paragraph4')}</p>
			<p>{t('recipe.help.paragraph5')}</p>
			<p>{t('recipe.help.paragraph6')}</p>
		</div>
	);
};

export default HelpContentsComponent;
