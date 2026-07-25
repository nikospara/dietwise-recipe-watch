import { useState } from 'react';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonItem,
	IonLabel,
	IonList,
	IonListHeader,
	IonModal,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { TbInfoSquareRounded } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import type { Rating } from '@/recipe/model';
import { encouragedRatio, limitedRatio } from '@/recipe/reducers/calculateRating';
import './RatingComponent.css';

export interface RatingComponentProps {
	rating: Rating | undefined;
	max: number;
}

const RatingComponent: React.FC<RatingComponentProps> = (props: RatingComponentProps) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);
	const rating = props.rating;
	const limited = rating ? limitedRatio(rating) : 0;
	const encouraged = rating ? encouragedRatio(rating) : 0;
	const encouragedPresent = rating?.encouragedPresent ?? [];
	const limitedPresent = rating?.limitedPresent ?? [];
	const bothPresent = encouragedPresent.length > 0 && limitedPresent.length > 0;

	const openDetails = () => {
		if (rating) setIsOpen(true);
	};

	const renderComponents = (names: string[]) =>
		names.length ? (
			names.map((name) => (
				<IonItem key={name}>
					<IonLabel className="rating-bipolar__component">{name}</IonLabel>
				</IonItem>
			))
		) : (
			<IonItem>
				<IonLabel color="medium">{t('recipe.rating.none')}</IonLabel>
			</IonItem>
		);

	return (
		<>
			<div
				className="rating-bipolar"
				role="button"
				tabIndex={0}
				aria-label={t('recipe.rating.detailsTitle')}
				onClick={openDetails}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault();
						openDetails();
					}
				}}
			>
				<div className="rating-bipolar__track rating-bipolar__track--limited">
					<div
						className="rating-bipolar__fill rating-bipolar__fill--limited"
						style={{ width: `${limited * 100}%` }}
					/>
				</div>
				<TbInfoSquareRounded className="rating-bipolar__center" aria-hidden="true" />
				<div className="rating-bipolar__track rating-bipolar__track--encouraged">
					<div
						className="rating-bipolar__fill rating-bipolar__fill--encouraged"
						style={{ width: `${encouraged * 100}%` }}
					/>
				</div>
			</div>
			<IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
				<IonHeader>
					<IonToolbar>
						<IonTitle>{t('recipe.rating.detailsTitle')}</IonTitle>
						<IonButtons slot="end">
							<IonButton onClick={() => setIsOpen(false)}>{t('general.OK')}</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonHeader>
				<IonContent>
					<IonList>
						<IonListHeader>{t('recipe.rating.encouragedPresent')}</IonListHeader>
						{renderComponents(encouragedPresent)}
						<IonListHeader className={bothPresent ? 'rating-bipolar__section-gap' : undefined}>
							{t('recipe.rating.limitedPresent')}
						</IonListHeader>
						{renderComponents(limitedPresent)}
					</IonList>
				</IonContent>
			</IonModal>
		</>
	);
};

export default RatingComponent;
