import { atom } from 'jotai';
import { atomWithRefresh, unwrap } from 'jotai/utils';
import { t } from 'i18next';
import { getValidAccessToken } from 'auth/authService';
import { apiServerHostAtom } from 'settings/atoms';
import type { PersonalInfo } from './model';
import { fetchPersonalInfo, savePersonalInfo } from './api';

export const personalInfoAtom = atomWithRefresh(async (get, { signal }) => {
	const accessToken = await getValidAccessToken();
	if (typeof accessToken === 'string') {
		const apiServerHost = get(apiServerHostAtom);
		return fetchPersonalInfo(apiServerHost, accessToken, signal);
	}
	return {};
});

export type PersonalInfoSaveState =
	| { status: 'idle' }
	| { status: 'saving' }
	| { status: 'success' }
	| { status: 'error'; errorMessage: string };

export const personalInfoSaveStateAtom = atom<PersonalInfoSaveState>({ status: 'idle' });

export const savePersonalInfoAtom = atom(null, async (get, _set, value: PersonalInfo) => {
	_set(personalInfoSaveStateAtom, { status: 'saving' });
	try {
		const accessToken = await getValidAccessToken();
		if (typeof accessToken === 'string') {
			const apiServerHost = get(apiServerHostAtom);
			await savePersonalInfo(apiServerHost, accessToken, value);
		}
		_set(personalInfoSaveStateAtom, { status: 'success' });
	} catch (e) {
		_set(personalInfoSaveStateAtom, {
			status: 'error',
			errorMessage: e instanceof Error ? e.message : t('error.unknown'),
		});
		throw e;
	}
});

const LOADING = Symbol('personal-info-loading');

const unwrappedPersonalInfoAtom = unwrap(personalInfoAtom, () => LOADING);

type LoadablePersonalInfo =
	| { state: 'loading' }
	| { state: 'hasError'; error: unknown }
	| { state: 'hasData'; data: PersonalInfo };

export const loadablePersonalInfoAtom = atom<LoadablePersonalInfo>((get) => {
	try {
		const data = get(unwrappedPersonalInfoAtom);
		if (data === LOADING) {
			return { state: 'loading' } as const;
		}
		return { state: 'hasData', data: data as PersonalInfo } as const;
	} catch (error) {
		return { state: 'hasError', error } as const;
	}
});
