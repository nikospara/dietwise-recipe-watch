import { describe, it, expect } from 'vitest';
import { setGradleVersion, setPbxprojVersion } from './set-app-version.mjs';

const GRADLE = `    defaultConfig {
        applicationId "eu.dietwise.recipewatch"
        minSdkVersion rootProject.ext.minSdkVersion
        versionCode 1
        versionName "0.8.1"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }`;

describe('setGradleVersion', () => {
	it('sets versionName from package.json and versionCode from the build number', () => {
		const out = setGradleVersion(GRADLE, { versionName: '0.12.0', versionCode: 5 });
		expect(out).toContain('versionCode 5');
		expect(out).toContain('versionName "0.12.0"');
		expect(out).not.toContain('0.8.1');
		expect(out).not.toMatch(/versionCode 1\b/);
	});

	it('throws if the version markers are missing', () => {
		expect(() => setGradleVersion('nothing here', { versionName: '1.0.0', versionCode: 5 })).toThrow();
	});
});

// Two build configurations (Debug + Release) each carry both keys.
const PBXPROJ = `
				CURRENT_PROJECT_VERSION = 1;
				MARKETING_VERSION = 1.0;
				PRODUCT_NAME = "$(TARGET_NAME)";
				CURRENT_PROJECT_VERSION = 1;
				MARKETING_VERSION = 1.0;
				PRODUCT_NAME = "$(TARGET_NAME)";
`;

describe('setPbxprojVersion', () => {
	it('updates both build configurations', () => {
		const out = setPbxprojVersion(PBXPROJ, { marketingVersion: '0.12.0', currentProjectVersion: 5 });
		expect(out.match(/CURRENT_PROJECT_VERSION = 5;/g)).toHaveLength(2);
		expect(out.match(/MARKETING_VERSION = 0\.12\.0;/g)).toHaveLength(2);
		expect(out).not.toContain('= 1.0;');
		expect(out).not.toMatch(/CURRENT_PROJECT_VERSION = 1;/);
	});

	it('throws if the version markers are missing', () => {
		expect(() => setPbxprojVersion('nope', { marketingVersion: '1.0.0', currentProjectVersion: 5 })).toThrow();
	});
});
