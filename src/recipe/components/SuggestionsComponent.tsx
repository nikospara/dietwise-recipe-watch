import { IonList } from '@ionic/react';
import { useAtom } from 'jotai';
import { mainStateAtom } from 'recipe/atoms';
import { useTranslation } from 'react-i18next';
import { createSuggestionStatusAction } from 'recipe/actions';
import SuggestionComponent from './SuggestionComponent';
import type { SuggestionStatus } from 'recipe/model';
import './SuggestionsComponent.css';

const SuggestionsComponent: React.FC = () => {
	const { t } = useTranslation();
	const [mainState, dispatch] = useAtom(mainStateAtom);

	if (mainState.suggestionKeys?.length) {
		return (
			<div className="sugestions-pane">
				<h2 className="sticky-suggestions-title">{t('recipe.titleOfSuggestions')}</h2>
				<IonList>
					{mainState.suggestionKeys.map((suggestionKey) => {
						const suggestionState = mainState.suggestions?.[suggestionKey];
						if (!suggestionState) return null;
						const status = suggestionState.status;
						const onAction = (action: SuggestionStatus) => {
							if (status === action) {
								dispatch(createSuggestionStatusAction(suggestionKey, 'UNDECIDED'));
							} else {
								dispatch(createSuggestionStatusAction(suggestionKey, action));
							}
						};
						return (
							<SuggestionComponent
								key={suggestionKey}
								suggestion={suggestionState.suggestion}
								status={status}
								onAction={onAction}
							/>
						);
					})}
				</IonList>
			</div>
		);
	} else if (mainState.errors && mainState.recipes) {
		return (
			<div className="sugestions-pane error-pane">
				<h2>{t('recipe.encounteredErrors')}</h2>
				<ul>
					{mainState.errors.map((err, index) => (
						<li key={index}>{err}</li>
					))}
				</ul>
			</div>
		);
	} else {
		return null;
	}
};

export default SuggestionsComponent;
