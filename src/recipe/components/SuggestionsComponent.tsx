import { IonList } from '@ionic/react';
import { useAtom, useAtomValue } from 'jotai';
import { apiServerHostAtom } from '@/config/atoms';
import { mainStateAtom } from '@/recipe/atoms';
import { useTranslation } from 'react-i18next';
import { createSuggestionStatusAction } from '@/recipe/actions';
import SuggestionComponent from './SuggestionComponent';
import type { SuggestionStatus } from '@/recipe/model';
import { waitForSuggestionStatisticsWithTimeout } from './suggestionsStatisticsUtils';
import { useSuggestionInFlight } from './useSuggestionInFlight';
import './SuggestionsComponent.css';

const SuggestionsComponent: React.FC = () => {
	const { t } = useTranslation();
	const [mainState, dispatch] = useAtom(mainStateAtom);
	const apiServerHost = useAtomValue(apiServerHostAtom);
	const { isSuggestionInFlight, setSuggestionInFlight } = useSuggestionInFlight();

	if (mainState.suggestionKeys?.length) {
		return (
			<div className="sugestions-pane">
				<h2 className="sticky-suggestions-title">{t('recipe.titleOfSuggestions')}</h2>
				<IonList>
					{mainState.suggestionKeys.map((suggestionKey) => {
						const suggestionState = mainState.suggestions?.[suggestionKey];
						if (!suggestionState) return null;
						const status = suggestionState.status;
						const onAction = async (action: SuggestionStatus) => {
							if (isSuggestionInFlight(suggestionKey)) {
								return;
							}

							const nextStatus = status === action ? 'UNDECIDED' : action;
							const previousAcceptedSuggestionKey =
								nextStatus === 'ACCEPTED' && suggestionState.suggestion.target.type === 'INGREDIENT'
									? mainState.ingredientState?.[suggestionState.suggestion.target.ingredient]
									: undefined;
							const previousAcceptedSuggestion =
								previousAcceptedSuggestionKey && previousAcceptedSuggestionKey !== suggestionKey
									? mainState.suggestions?.[previousAcceptedSuggestionKey]
									: undefined;
							const lockedSuggestionKeys = previousAcceptedSuggestionKey
								? [suggestionKey, previousAcceptedSuggestionKey]
								: [suggestionKey];
							dispatch(createSuggestionStatusAction(suggestionKey, nextStatus));
							for (const lockedSuggestionKey of lockedSuggestionKeys) {
								setSuggestionInFlight(lockedSuggestionKey, true);
							}
							try {
								if (previousAcceptedSuggestion) {
									await waitForSuggestionStatisticsWithTimeout(
										apiServerHost,
										previousAcceptedSuggestion.suggestion.id,
										'ACCEPTED',
										'UNDECIDED',
									);
								}
								await waitForSuggestionStatisticsWithTimeout(
									apiServerHost,
									suggestionState.suggestion.id,
									status,
									nextStatus,
								);
							} catch (error) {
								console.error('Unable to notify suggestion statistics', error);
							} finally {
								for (const lockedSuggestionKey of lockedSuggestionKeys) {
									setSuggestionInFlight(lockedSuggestionKey, false);
								}
							}
						};
						return (
							<SuggestionComponent
								key={suggestionKey}
								suggestion={suggestionState.suggestion}
								status={status}
								disabled={isSuggestionInFlight(suggestionKey)}
								onAction={onAction}
							/>
						);
					})}
				</IonList>
			</div>
		);
	} else if ((mainState.emptySuggestionsFromServer || mainState.errors) && mainState.recipes) {
		return (
			<div className="sugestions-pane error-pane">
				<h2>{t('recipe.encounteredErrors')}</h2>
				<ul>
					{mainState.errors ? mainState.errors.map((err, index) => <li key={index}>{err}</li>) : null}
					{mainState.emptySuggestionsFromServer ? <li>{t('recipe.emptySuggestionsFromServer')}</li> : null}
				</ul>
			</div>
		);
	} else {
		return null;
	}
};

export default SuggestionsComponent;
