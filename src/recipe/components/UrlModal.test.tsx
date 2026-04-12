import type { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import UrlModal from './UrlModal';

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

vi.mock('@ionic/react', async () => {
	const actual = await vi.importActual<typeof import('@ionic/react')>('@ionic/react');
	return {
		...actual,
		IonModal: ({ isOpen, children }: { isOpen: boolean; children: ReactNode }) =>
			isOpen ? <div data-testid="ion-modal">{children}</div> : null,
	};
});

describe('UrlModal', () => {
	it('renders title, actions, and initial url', () => {
		render(
			<UrlModal isOpen={true} setIsOpen={vi.fn()} url="https://example.com" language="en" setData={vi.fn()} />,
		);

		expect(screen.getByText('recipe.enterUrlModalTitle')).toBeTruthy();
		expect(screen.getByText('general.CANCEL')).toBeTruthy();
		expect(screen.getByText('recipe.ASSESS')).toBeTruthy();
		const ionTextarea = document.querySelector('ion-textarea');
		expect(ionTextarea).toBeTruthy();
		const inputValue = ionTextarea?.getAttribute('value') ?? (ionTextarea as { value?: string } | null)?.value;
		expect(inputValue).toBe('https://example.com');
	});

	it('closes on cancel', () => {
		const setIsOpen = vi.fn();
		render(<UrlModal isOpen={true} setIsOpen={setIsOpen} url="" language="en" setData={vi.fn()} />);

		fireEvent.click(screen.getByText('general.CANCEL'));

		expect(setIsOpen).toHaveBeenCalledWith(false);
	});

	it('assesses trimmed url and closes when changed', () => {
		const setIsOpen = vi.fn();
		const setData = vi.fn();
		const { container } = render(
			<UrlModal isOpen={true} setIsOpen={setIsOpen} url="https://old.com" language="en" setData={setData} />,
		);

		const ionTextarea = container.querySelector('ion-textarea');
		expect(ionTextarea).toBeTruthy();
		const ionInputEvent = new CustomEvent('ionInput', {
			bubbles: true,
			cancelable: true,
			detail: { value: ' https://new.com/path ' },
		});
		Object.defineProperty(ionInputEvent, 'target', {
			value: { value: ' https://new.com/path ' },
		});
		fireEvent(ionTextarea as Element, ionInputEvent);

		fireEvent.click(screen.getByText('recipe.ASSESS'));

		expect(setData).toHaveBeenCalledWith('https://new.com/path', 'en');
		expect(setIsOpen).toHaveBeenCalledWith(false);
	});
});
