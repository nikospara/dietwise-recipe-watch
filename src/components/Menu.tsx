import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import { addIcons } from 'ionicons';
import {
	homeOutline,
	homeSharp,
	logInOutline,
	logInSharp,
	logOutOutline,
	logOutSharp,
	settingsOutline,
	settingsSharp,
} from 'ionicons/icons';
import type { Location } from 'history';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'auth/useAuth';
import './Menu.css';

addIcons({
	logo: 'src/assets/images/DietWise_icon_Orange.svg',
});

interface AppMenuItemProps {
	titleKey: string;
	url: string;
	iosIcon: string;
	mdIcon: string;
	location: Location<unknown>;
	disabled?: boolean;
}

const AppMenuItem: React.FC<AppMenuItemProps> = ({ titleKey, url, iosIcon, mdIcon, location, disabled }) => {
	const { t } = useTranslation();

	return (
		<IonMenuToggle autoHide={false}>
			<IonItem
				className={location.pathname === url ? 'selected' : ''}
				routerLink={url}
				routerDirection="none"
				lines="none"
				detail={false}
				disabled={disabled}
			>
				<IonIcon aria-hidden="true" slot="start" ios={iosIcon} md={mdIcon} />
				<IonLabel>{t([`menu.${titleKey}`, `${titleKey}.title`])}</IonLabel>
			</IonItem>
		</IonMenuToggle>
	);
};

const Menu: React.FC = () => {
	const location = useLocation();
	const { user, signIn, signOut } = useAuth();
	const { t } = useTranslation();

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>
						<IonIcon icon="logo" aria-hidden="true" />
						<IonLabel>
							<h1>Recipe Watch</h1>
							<p className="ion-text-nowrap">{user ? user.email : t('menu.anonymous')}</p>
						</IonLabel>
					</IonListHeader>
					{/*}
					<IonListHeader>
						<IonIcon icon="logo" aria-hidden="true" />
						Recipe Watch
					</IonListHeader>
					<IonNote>{user ? user.email : t('menu.anonymous')}</IonNote>
					*/}
					<AppMenuItem
						titleKey="home"
						url="/Home"
						iosIcon={homeOutline}
						mdIcon={homeSharp}
						location={location}
					/>
					<AppMenuItem
						titleKey="settings"
						url="/Settings"
						iosIcon={settingsOutline}
						mdIcon={settingsSharp}
						location={location}
					/>
				</IonList>

				<IonList id="labels-list">
					{user ? (
						<IonMenuToggle autoHide={false} onClick={signOut}>
							<IonItem lines="none" button={true}>
								<IonIcon aria-hidden="true" slot="start" ios={logOutOutline} md={logOutSharp} />
								<IonLabel>{t('menu.logout')}</IonLabel>
							</IonItem>
						</IonMenuToggle>
					) : (
						<IonMenuToggle autoHide={false} onClick={signIn}>
							<IonItem lines="none" button={true}>
								<IonIcon aria-hidden="true" slot="start" ios={logInOutline} md={logInSharp} />
								<IonLabel>{t('menu.login')}</IonLabel>
							</IonItem>
						</IonMenuToggle>
					)}
				</IonList>
			</IonContent>
		</IonMenu>
	);
};

export default Menu;
