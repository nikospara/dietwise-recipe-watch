import type { RecipeAssessmentMessage, RecipeExtractionAndAssessmentParam } from './model';
import { streamJson } from '@/common/streamJson';
import { getValidAccessToken } from '@/auth/authService';

export interface CancellationFunction {
	(): void;
}

export async function assessRecipe(
	apiServerHost: string,
	url: string,
	lang: string,
	onMessage?: (message: RecipeAssessmentMessage) => void,
	onError?: (error: unknown) => void,
	onComplete?: () => void,
): Promise<CancellationFunction> {
	const accessToken = await getValidAccessToken();
	const handler = streamJson(
		apiServerHost + '/recipe/assess/url',
		{
			url,
			// viewPort would go here
			lang,
		} as RecipeExtractionAndAssessmentParam,
		{
			onMessage,
			onError,
			onComplete,
			headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
		},
	);
	return () => handler.cancel();
}
