import { useCallback, useRef } from 'react';
import { useAtom } from 'jotai';
import { suggestionInFlightAtom } from '@/recipe/atoms';

/**
 * Tracks per-suggestion in-flight UI locks while also blocking same-frame repeat clicks
 * before the atom-backed disabled state has rerendered.
 */
export function useSuggestionInFlight() {
	const [inFlightSuggestionKeys, setInFlightSuggestionKeys] = useAtom(suggestionInFlightAtom);
	// Blocks repeated clicks before the atom update has rerendered the disabled buttons.
	const inFlightSuggestionKeysRef = useRef(new Set<string>());

	const isSuggestionInFlight = useCallback(
		(suggestionKey: string) => {
			return (
				inFlightSuggestionKeysRef.current.has(suggestionKey) || Boolean(inFlightSuggestionKeys[suggestionKey])
			);
		},
		[inFlightSuggestionKeys],
	);

	const setSuggestionInFlight = useCallback(
		(suggestionKey: string, inFlight: boolean) => {
			if (inFlight) {
				inFlightSuggestionKeysRef.current.add(suggestionKey);
			} else {
				inFlightSuggestionKeysRef.current.delete(suggestionKey);
			}

			setInFlightSuggestionKeys((current) => {
				if (inFlight) {
					return { ...current, [suggestionKey]: true };
				}

				if (!current[suggestionKey]) {
					return current;
				}

				const next = { ...current };
				delete next[suggestionKey];
				return next;
			});
		},
		[setInFlightSuggestionKeys],
	);

	return {
		isSuggestionInFlight,
		setSuggestionInFlight,
	};
}
