import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../', import.meta.url);
const GRADLE_PATH = new URL('android/app/build.gradle', ROOT);
const PBXPROJ_PATH = new URL('ios/App/App.xcodeproj/project.pbxproj', ROOT);

// versionName is the user-visible string (from package.json); versionCode is the
// integer Google Play orders uploads by — it must strictly increase per upload.
export function setGradleVersion(content, { versionName, versionCode }) {
	let replacements = 0;
	let out = content.replace(/(versionName\s*=?\s*)"[^"]*"/, (_, prefix) => {
		replacements++;
		return `${prefix}"${versionName}"`;
	});
	out = out.replace(/(versionCode\s*=?\s*)\d+/, (_, prefix) => {
		replacements++;
		return `${prefix}${versionCode}`;
	});
	if (replacements !== 2) {
		throw new Error(
			`build.gradle: expected to update versionName and versionCode, made ${replacements} replacement(s)`,
		);
	}
	return out;
}

// MARKETING_VERSION maps to CFBundleShortVersionString (user-visible); CURRENT_PROJECT_VERSION
// maps to CFBundleVersion, which the App Store orders uploads by within a marketing version.
// Both keys appear once per build configuration (Debug + Release), so every match is rewritten.
export function setPbxprojVersion(content, { marketingVersion, currentProjectVersion }) {
	let marketing = 0;
	let current = 0;
	let out = content.replace(/MARKETING_VERSION = [^;]+;/g, () => {
		marketing++;
		return `MARKETING_VERSION = ${marketingVersion};`;
	});
	out = out.replace(/CURRENT_PROJECT_VERSION = [^;]+;/g, () => {
		current++;
		return `CURRENT_PROJECT_VERSION = ${currentProjectVersion};`;
	});
	if (marketing === 0 || current === 0) {
		throw new Error(
			`project.pbxproj: expected MARKETING_VERSION and CURRENT_PROJECT_VERSION, found ${marketing} and ${current}`,
		);
	}
	return out;
}

function readPackageVersion() {
	const pkg = JSON.parse(readFileSync(new URL('package.json', ROOT), 'utf8'));
	if (!pkg.version) {
		throw new Error('package.json has no "version" field');
	}
	return pkg.version;
}

function parseBuildNumber(arg) {
	if (!/^\d+$/.test(arg ?? '')) {
		throw new Error(
			'Usage: node scripts/set-app-version.mjs <buildNumber>\n' +
				'  <buildNumber>  integer for versionCode (Android) / CURRENT_PROJECT_VERSION (iOS).\n' +
				'                 Must be higher than the largest build already uploaded to either store.',
		);
	}
	return Number(arg);
}

function main() {
	const buildNumber = parseBuildNumber(process.argv[2]);
	const version = readPackageVersion();

	writeFileSync(
		GRADLE_PATH,
		setGradleVersion(readFileSync(GRADLE_PATH, 'utf8'), { versionName: version, versionCode: buildNumber }),
	);
	writeFileSync(
		PBXPROJ_PATH,
		setPbxprojVersion(readFileSync(PBXPROJ_PATH, 'utf8'), {
			marketingVersion: version,
			currentProjectVersion: buildNumber,
		}),
	);

	console.log(`Set version ${version} (build ${buildNumber}) in android/ and ios/.`);
}

if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		main();
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}
