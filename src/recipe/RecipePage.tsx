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
import { useAtom, useAtomValue } from 'jotai';
import { mainStateAtom } from 'recipe/atoms';
import { apiServerHostAtom } from 'config/atoms';
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
import UrlContainer from 'recipe/components/UrlContainer';
import UrlModal from 'recipe/components/UrlModal';
import SplitPane from 'recipe/components/SplitPane';
import RecipesComponent from 'recipe/components/RecipesComponent';
import SuggestionsComponent from 'recipe/components/SuggestionsComponent';
import { hasRecipesContent } from './components/recipesComponentUtils';
import { hasSuggestionsContent } from 'recipe/components/suggestionsComponentUtils';
import './RecipePage.css';

const RecipePage: React.FC = () => {
	const { t } = useTranslation();
	const [mainState, dispatch] = useAtom(mainStateAtom);
	const apiServerHost = useAtomValue(apiServerHostAtom);
	const [isUrlModalOpen, setUrlModalIsOpen] = useState(false);

	const cancelRef = useRef<CancellationFunction>(null);

	const assessRecipeCallback = useCallback(
		async (url: string) => {
			try {
				dispatch(createPrepareToAssessRecipeAction(url));
				cancelRef.current = await assessRecipe(
					apiServerHost,
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
		[dispatch, apiServerHost],
	);

	const resetCallback = useCallback(() => dispatch(createResetMainPageAction()), [dispatch]);

	const hasOutcome = mainState.status === 'SUCCESS' || mainState.status === 'FAILURE';
	const assessing = mainState.status === 'PENDING';
	const recipesProps = {
		status: mainState.status,
		recipes: mainState.recipes,
		detectionTypes: mainState.detectionTypes,
		suggestions: mainState.suggestions,
		errors: mainState.errors,
	};
	const topPaneContent = hasRecipesContent(recipesProps) ? <RecipesComponent {...recipesProps} /> : null;
	const bottomPaneContent = hasSuggestionsContent(mainState) ? <SuggestionsComponent /> : null;

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

			<IonContent fullscreen scrollY={false}>
				{/* Reminder, the inner, collapse=condense header is for iOS: https://ionicframework.com/docs/api/header#condensed-header */}
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">{t('recipe.title')}</IonTitle>
					</IonToolbar>
				</IonHeader>

				<div className="recipe-page__content">
					<UrlContainer
						onClick={() => setUrlModalIsOpen(true)}
						url={mainState.url}
						status={mainState.status}
					/>
					<SplitPane className="recipe-page__split" top={topPaneContent} bottom={bottomPaneContent} />
				</div>

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
