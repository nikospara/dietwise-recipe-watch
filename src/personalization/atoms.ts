import { atom, WritableAtom } from 'jotai';
import { unwrap } from 'jotai/utils';
import { getValidAccessToken } from 'auth/authService';
import { apiServerHostAtom } from 'settings/atoms';
import type { PersonalInfo } from './model';
import { fetchPersonalInfo, savePersonalInfo } from './api';

// TODO Use atomWithRefresh: https://jotai.org/docs/utilities/resettable#atomwithrefresh
export const personalInfoAtom: WritableAtom<Promise<PersonalInfo>, [PersonalInfo], Promise<void>> = atom(
	async (get, { signal }) => {
		const accessToken = await getValidAccessToken();
		if (typeof accessToken === 'string') {
			const apiServerHost = get(apiServerHostAtom);
			return fetchPersonalInfo(apiServerHost, accessToken, signal);
		}
		return {};
	},
	async (get, _set, value: PersonalInfo) => {
		const accessToken = await getValidAccessToken();
		if (typeof accessToken === 'string') {
			const apiServerHost = get(apiServerHostAtom);
			await savePersonalInfo(apiServerHost, accessToken, value);
		}
	},
);

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
