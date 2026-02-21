import type { SuggestionsComponentProps } from './SuggestionsComponent';

export const hasSuggestionsContent = (props: SuggestionsComponentProps): boolean => {
	return Boolean(props.suggestions?.length || (props.errors && props.recipes));
};
