// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
//
// DietWise: See https://ionicframework.com/docs/react/testing/unit-testing/setup
import { setupIonicReact } from '@ionic/react';

setupIonicReact();

// Mock matchmedia
window.matchMedia = window.matchMedia || function() {
	return {
		matches: false,
		addListener: function() {},
		removeListener: function() {}
	};
};
