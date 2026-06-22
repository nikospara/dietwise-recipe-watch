import { IonButton, IonIcon } from '@ionic/react';
import { sunny, sunnyOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

interface CookingModeToggleProps {
	active: boolean;
	onToggle: () => void;
}

const CookingModeToggle: React.FC<CookingModeToggleProps> = ({ active, onToggle }) => {
	const { t } = useTranslation();
	return (
		<IonButton
			className="cooking-mode-toggle"
			size="small"
			fill={active ? 'solid' : 'outline'}
			aria-pressed={active ? 'true' : 'false'}
			onClick={onToggle}
		>
			<IonIcon slot="start" icon={active ? sunny : sunnyOutline} />
			{t('recipe.keepScreenOn')}
		</IonButton>
	);
};

export default CookingModeToggle;
