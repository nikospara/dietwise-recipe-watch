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
import SplitPane from 'recipe/SplitPane';
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

	const topPaneContent = mainState.recipes?.length ? (
		<div className="recipe-pane">
			{mainState.recipes.map((recipe, index) => (
				<section key={`${recipe.name ?? 'recipe'}-${index}`} className="recipe-pane__item">
					{recipe.name ? <h2 className="recipe-pane__title">{recipe.name}</h2> : null}
					{recipe.text ? <pre className="recipe-pane__text">{recipe.text}</pre> : null}
				</section>
			))}
		</div>
	) : null;

	const bottomPaneContent = mainState.suggestions?.length ? (
		<div className="recipe-pane">
			<ul className="recipe-pane__list">
				{mainState.suggestions.map((suggestion, index) => (
					<li key={index} className="recipe-pane__list-item">
						{suggestion.text}
					</li>
				))}
			</ul>
		</div>
	) : null;

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
