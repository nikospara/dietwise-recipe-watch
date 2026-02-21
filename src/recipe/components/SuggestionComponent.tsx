import type { Suggestion } from 'recipe/model';

export interface SuggestionComponentProps {
	suggestion: Suggestion;
}

const SuggestionComponent: React.FC<SuggestionComponentProps> = (props: SuggestionComponentProps) => {
	return <div>{props.suggestion.text ? props.suggestion.text : '-'}</div>;
};

export default SuggestionComponent;
