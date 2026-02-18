// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
//
// DietWise: See https://ionicframework.com/docs/react/testing/unit-testing/setup
export {};
//
// jsdom@28 can expose adoptedStyleSheets as undefined in test env while Stencil
// expects it to exist on both Document and ShadowRoot during module init.
const installAdoptedStyleSheetsShim = (target: object) => {
	if (!target || Object.getOwnPropertyDescriptor(target, 'adoptedStyleSheets')) {
		return;
	}

	const sheetStore = new WeakMap<object, CSSStyleSheet[]>();
	Object.defineProperty(target, 'adoptedStyleSheets', {
		configurable: true,
		enumerable: true,
		get() {
			let sheets = sheetStore.get(this);
			if (!sheets) {
				sheets = [];
				// Make length non-writable so Stencil does not assume mutable support.
				Object.defineProperty(sheets, 'length', { writable: false });
				sheetStore.set(this, sheets);
			}
			return sheets;
		},
		set(value: CSSStyleSheet[]) {
			sheetStore.set(this, value);
		},
	});
};

if (typeof Document !== 'undefined') {
	installAdoptedStyleSheetsShim(Document.prototype);
}

if (typeof ShadowRoot !== 'undefined') {
	installAdoptedStyleSheetsShim(ShadowRoot.prototype);
}

const { setupIonicReact } = await import('@ionic/react');
setupIonicReact();

// Mock matchmedia
window.matchMedia =
	window.matchMedia ||
	function () {
		return {
			matches: false,
			addListener: function () {},
			removeListener: function () {},
		};
	};
