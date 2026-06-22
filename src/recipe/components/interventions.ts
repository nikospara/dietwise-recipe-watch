export const INTERVENTION_COUNT = 5;

export function randomInterventionKey(random: () => number = Math.random): string {
	const index = Math.floor(random() * INTERVENTION_COUNT) + 1;
	return `interventions.${index}`;
}
