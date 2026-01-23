import type { RecipeAssessmentMessage, RecipeExtractionAndAssessmentParam } from './model';
import { streamJson } from 'common/streamJson';

export interface CancellationFunction {
	(): void;
}

export function assessRecipe(
	url: string,
	langCode: string,
	onMessage?: (message: RecipeAssessmentMessage) => void,
	onError?: (error: unknown) => void,
	onComplete?: () => void,
): CancellationFunction {
	const handler = streamJson(
		// TODO Parameterize this!!!
		'http://localhost:8180/api/v1/recipe/assess/url',
		{
			url,
			// viewPort would go here
			langCode,
		} as RecipeExtractionAndAssessmentParam,
		{
			onMessage,
			onError,
			onComplete,
		},
	);
	return () => handler.cancel();
}
