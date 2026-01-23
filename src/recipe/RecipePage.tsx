import { useCallback, useRef, useState } from 'react';
import {
	IonButtons,
	IonContent,
	IonFab,
	IonFabButton,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonPage,
	IonTitle,
	IonToolbar,
} from '@ionic/react';
import { arrowUndo } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { mainStateAtom } from 'recipe/atoms';
import {
	createPrepareToAssessRecipeAction,
	createRecipeAssessmentCompletedAction,
	createRecipeAssessmentFailedAction,
	createResetMainPageAction,
	createMessageReceivedAction,
} from 'recipe/actions';
import { assessRecipe } from 'recipe/assessRecipe';
import type { CancellationFunction } from 'recipe/assessRecipe';
import i18next from 'i18next';
import UrlContainer from 'recipe/UrlContainer';
import UrlModal from 'recipe/UrlModal';
import './RecipePage.css';

const RecipePage: React.FC = () => {
	const { t } = useTranslation();
	const [mainState, dispatch] = useAtom(mainStateAtom);
	const [isUrlModalOpen, setUrlModalIsOpen] = useState(false);

	const cancelRef = useRef<CancellationFunction>(null);

	const assessRecipeCallback = useCallback(
		async (url: string) => {
			try {
				dispatch(createPrepareToAssessRecipeAction(url));
				cancelRef.current = assessRecipe(
					url || '',
					i18next.language,
					(message) => {
						dispatch(createMessageReceivedAction(message));
					},
					(error) => {
						cancelRef.current = null;
						dispatch(createRecipeAssessmentFailedAction(error));
					},
					() => {
						cancelRef.current = null;
						dispatch(createRecipeAssessmentCompletedAction());
					},
				);
			} catch (error) {
				dispatch(createRecipeAssessmentFailedAction(error));
			}
		},
		[dispatch],
	);

	const resetCallback = useCallback(() => dispatch(createResetMainPageAction()), [dispatch]);

	const hasOutcome = mainState.status === 'SUCCESS' || mainState.status === 'FAILURE';
	const assessing = mainState.status === 'PENDING';

	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{t('recipe.title')}</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				{/* Reminder, the inner, collapse=condense header is for iOS: https://ionicframework.com/docs/api/header#condensed-header */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{t('recipe.title')}</IonTitle>
					</IonToolbar>
				</IonHeader>

				<UrlContainer onClick={() => setUrlModalIsOpen(true)} url={mainState.url} status={mainState.status} />

				<UrlModal
					isOpen={isUrlModalOpen}
					setIsOpen={setUrlModalIsOpen}
					url={mainState.url}
					setUrl={assessRecipeCallback}
				/>

				{assessing || hasOutcome ? (
					<IonFab slot="fixed" vertical="bottom" horizontal="end">
						<IonFabButton onClick={resetCallback} disabled={assessing}>
							<IonIcon icon={arrowUndo}></IonIcon>
						</IonFabButton>
					</IonFab>
				) : null}
			</IonContent>
		</IonPage>
	);
};

export default RecipePage;
