import type { Recipe, Suggestion } from 'recipe/model';
import { useTranslation } from 'react-i18next';
import SuggestionComponent from './SuggestionComponent';
import type { MainDataStatus } from './model';

export interface SuggestionsComponentProps {
	status: MainDataStatus;
	recipes: Recipe[] | undefined;
	suggestions: Suggestion[] | undefined;
	errors: string[] | undefined;
}

const SuggestionsComponent: React.FC<SuggestionsComponentProps> = (props: SuggestionsComponentProps) => {
	const { t } = useTranslation();

	if (props.suggestions?.length) {
		return (
			<div className="sugestions-pane">
				<h2>{t('recipe.titleOfSuggestions')}</h2>
				{props.suggestions.map((suggestion, index) => (
					<SuggestionComponent key={index} suggestion={suggestion} />
				))}
			</div>
		);
	} else if (props.errors && props.recipes) {
		return (
			<div className="sugestions-pane error-pane">
				<h2>{t('recipe.encounteredErrors')}</h2>
				<ul>
					{props.errors.map((err, index) => (
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
