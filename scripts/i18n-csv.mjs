#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_TEMPLATE = 'src/i18n/en.json';

function main() {
	const [command, ...args] = process.argv.slice(2);

	if (!command || command === '--help' || command === '-h') {
		printHelp();
		process.exit(command ? 0 : 1);
	}

	const options = parseArgs(args);

	switch (command) {
		case 'export':
			exportCsv(options);
			break;
		case 'import':
			importCsv(options);
			break;
		default:
			fail(`Unknown command "${command}".`);
	}
}

function exportCsv(options) {
	const templatePath = resolvePath(options.template ?? DEFAULT_TEMPLATE);
	const outputPath = resolveRequiredPath(options.output, 'Missing --output for export.');
	const sourcePath = options.source ? resolvePath(options.source) : null;

	const template = readJson(templatePath);
	const localized = sourcePath ? readJson(sourcePath) : null;

	const templateEntries = flattenTranslations(template);
	const localizedEntries = localized ? flattenTranslations(localized) : new Map();

	if (localized) {
		assertSameKeys(templateEntries, localizedEntries, 'localized JSON');
	}

	const rows = [['code', 'english', 'localized']];

	for (const [code, english] of templateEntries.entries()) {
		rows.push([code, english, localizedEntries.get(code) ?? '']);
	}

	writeText(outputPath, rows.map(toCsvLine).join('\n') + '\n');
	console.log(`Wrote ${rows.length - 1} translations to ${outputPath}`);
}

function importCsv(options) {
	const templatePath = resolvePath(options.template ?? DEFAULT_TEMPLATE);
	const inputPath = resolveRequiredPath(options.input, 'Missing --input for import.');
	const outputPath = resolveRequiredPath(options.output, 'Missing --output for import.');

	const template = readJson(templatePath);
	const templateEntries = flattenTranslations(template);
	const csvRows = parseCsv(readText(inputPath));

	if (csvRows.length === 0) {
		fail('CSV input is empty.');
	}

	const header = csvRows[0];
	if (header.length < 3 || header[0] !== 'code' || header[1] !== 'english' || header[2] !== 'localized') {
		fail('CSV header must be exactly: code,english,localized');
	}

	const localizedEntries = new Map();

	for (let index = 1; index < csvRows.length; index += 1) {
		const row = csvRows[index];
		if (row.length === 1 && row[0] === '') {
			continue;
		}

		if (row.length < 3) {
			fail(`CSV row ${index + 1} must contain at least 3 columns.`);
		}

		const [code, english, localized] = row;

		if (!templateEntries.has(code)) {
			fail(`CSV row ${index + 1} contains unknown code "${code}".`);
		}

		const expectedEnglish = templateEntries.get(code);
		if (english !== expectedEnglish) {
			fail(
				`CSV row ${index + 1} has mismatched English text for "${code}". Expected "${expectedEnglish}" but got "${english}".`,
			);
		}

		if (localizedEntries.has(code)) {
			fail(`CSV row ${index + 1} duplicates code "${code}".`);
		}

		localizedEntries.set(code, localized ?? '');
	}

	assertSameKeys(templateEntries, localizedEntries, 'CSV input');

	const localizedJson = buildFromTemplate(template, [], localizedEntries);
	writeText(outputPath, `${JSON.stringify(localizedJson, null, '\t')}\n`);
	console.log(`Wrote ${localizedEntries.size} translations to ${outputPath}`);
}

function flattenTranslations(value, prefix = '', entries = new Map()) {
	if (typeof value === 'string') {
		if (!prefix) {
			fail('Template root cannot be a string.');
		}

		entries.set(prefix, value);
		return entries;
	}

	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		fail(`Expected nested translation object at "${prefix || '<root>'}".`);
	}

	for (const [key, child] of Object.entries(value)) {
		const childPrefix = prefix ? `${prefix}.${key}` : key;
		flattenTranslations(child, childPrefix, entries);
	}

	return entries;
}

function buildFromTemplate(templateNode, pathParts, localizedEntries) {
	if (typeof templateNode === 'string') {
		const code = pathParts.join('.');
		return localizedEntries.get(code) ?? '';
	}

	if (!templateNode || typeof templateNode !== 'object' || Array.isArray(templateNode)) {
		fail(`Expected nested translation object at "${pathParts.join('.') || '<root>'}".`);
	}

	const result = {};
	for (const [key, child] of Object.entries(templateNode)) {
		result[key] = buildFromTemplate(child, [...pathParts, key], localizedEntries);
	}

	return result;
}

function assertSameKeys(expectedEntries, actualEntries, label) {
	const missing = [];
	const extra = [];

	for (const key of expectedEntries.keys()) {
		if (!actualEntries.has(key)) {
			missing.push(key);
		}
	}

	for (const key of actualEntries.keys()) {
		if (!expectedEntries.has(key)) {
			extra.push(key);
		}
	}

	if (missing.length > 0 || extra.length > 0) {
		const details = [];
		if (missing.length > 0) {
			details.push(`missing keys: ${missing.join(', ')}`);
		}
		if (extra.length > 0) {
			details.push(`extra keys: ${extra.join(', ')}`);
		}
		fail(`${label} keys do not match template (${details.join('; ')}).`);
	}
}

function parseArgs(args) {
	const options = {};

	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (!arg.startsWith('--')) {
			fail(`Unexpected argument "${arg}".`);
		}

		const name = arg.slice(2);
		const value = args[index + 1];
		if (!value || value.startsWith('--')) {
			fail(`Missing value for --${name}.`);
		}

		options[name] = value;
		index += 1;
	}

	return options;
}

function parseCsv(text) {
	const rows = [];
	let row = [];
	let field = '';
	let index = 0;

	while (index < text.length) {
		const char = text[index];

		if (char === '"') {
			index += 1;
			while (index < text.length) {
				const quotedChar = text[index];
				if (quotedChar === '"') {
					if (text[index + 1] === '"') {
						field += '"';
						index += 2;
						continue;
					}
					index += 1;
					break;
				}
				field += quotedChar;
				index += 1;
			}
			continue;
		}

		if (char === ',') {
			row.push(field);
			field = '';
			index += 1;
			continue;
		}

		if (char === '\n') {
			row.push(field);
			rows.push(row);
			row = [];
			field = '';
			index += 1;
			continue;
		}

		if (char === '\r') {
			index += 1;
			continue;
		}

		field += char;
		index += 1;
	}

	if (field !== '' || row.length > 0) {
		row.push(field);
		rows.push(row);
	}

	return rows;
}

function toCsvLine(fields) {
	return fields.map(escapeCsvField).join(',');
}

function escapeCsvField(value) {
	const stringValue = String(value);
	if (/[",\n\r]/.test(stringValue)) {
		return `"${stringValue.replaceAll('"', '""')}"`;
	}
	return stringValue;
}

function resolvePath(filePath) {
	return path.resolve(process.cwd(), filePath);
}

function resolveRequiredPath(filePath, message) {
	if (!filePath) {
		fail(message);
	}
	return resolvePath(filePath);
}

function readJson(filePath) {
	return JSON.parse(readText(filePath));
}

function readText(filePath) {
	try {
		return fs.readFileSync(filePath, 'utf8');
	} catch (error) {
		fail(`Failed to read ${filePath}: ${error.message}`);
	}
}

function writeText(filePath, content) {
	try {
		fs.mkdirSync(path.dirname(filePath), { recursive: true });
		fs.writeFileSync(filePath, content, 'utf8');
	} catch (error) {
		fail(`Failed to write ${filePath}: ${error.message}`);
	}
}

function printHelp() {
	console.log(`Usage:
  node scripts/i18n-csv.mjs export --output <file.csv> [--template src/i18n/en.json] [--source <localized.json>]
  node scripts/i18n-csv.mjs import --input <file.csv> --output <localized.json> [--template src/i18n/en.json]

Examples:
  npm run i18n:csv:export -- --output translations/el.csv --source src/i18n/el.json
  npm run i18n:csv:export -- --output translations/nl.csv
  npm run i18n:csv:import -- --input translations/nl.csv --output src/i18n/nl.json`);
}

function fail(message) {
	console.error(message);
	process.exit(1);
}

main();
