import { render, screen } from '@testing-library/react';
import { Provider as JotaiProvider, createStore } from 'jotai';
import { describe, expect, it } from 'vitest';
import { useSuggestionInFlight } from './useSuggestionInFlight';

interface HookHarnessProps {
	suggestionKey: string;
}

const HookHarness: React.FC<HookHarnessProps> = ({ suggestionKey }) => {
	const { isSuggestionInFlight, setSuggestionInFlight } = useSuggestionInFlight();

	return (
		<div>
			<div data-testid="in-flight">{String(isSuggestionInFlight(suggestionKey))}</div>
			<button onClick={() => setSuggestionInFlight(suggestionKey, true)}>lock</button>
			<button onClick={() => setSuggestionInFlight(suggestionKey, false)}>unlock</button>
		</div>
	);
};

describe('useSuggestionInFlight', () => {
	it('marks and clears a suggestion as in flight', async () => {
		const user = (await import('@testing-library/user-event')).default.setup();
		render(
			<JotaiProvider>
				<HookHarness suggestionKey="s-1" />
			</JotaiProvider>,
		);

		expect(screen.getByTestId('in-flight').textContent).toBe('false');

		await user.click(screen.getByRole('button', { name: 'lock' }));
		expect(screen.getByTestId('in-flight').textContent).toBe('true');

		await user.click(screen.getByRole('button', { name: 'unlock' }));
		expect(screen.getByTestId('in-flight').textContent).toBe('false');
	});

	it('keeps the lock across remounts when the same jotai store is reused', async () => {
		const user = (await import('@testing-library/user-event')).default.setup();
		const store = createStore();
		const { unmount } = render(
			<JotaiProvider store={store}>
				<HookHarness suggestionKey="s-1" />
			</JotaiProvider>,
		);

		await user.click(screen.getByRole('button', { name: 'lock' }));
		expect(screen.getByTestId('in-flight').textContent).toBe('true');

		unmount();

		render(
			<JotaiProvider store={store}>
				<HookHarness suggestionKey="s-1" />
			</JotaiProvider>,
		);

		expect(screen.getByTestId('in-flight').textContent).toBe('true');
	});

	it('isolates locks per suggestion key', async () => {
		const user = (await import('@testing-library/user-event')).default.setup();
		render(
			<JotaiProvider>
				<>
					<HookHarness suggestionKey="s-1" />
					<HookHarness suggestionKey="s-2" />
				</>
			</JotaiProvider>,
		);

		const statuses = screen.getAllByTestId('in-flight');
		expect(statuses[0].textContent).toBe('false');
		expect(statuses[1].textContent).toBe('false');

		await user.click(screen.getAllByRole('button', { name: 'lock' })[0]);

		expect(statuses[0].textContent).toBe('true');
		expect(statuses[1].textContent).toBe('false');
	});
});
