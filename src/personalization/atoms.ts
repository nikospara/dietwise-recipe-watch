import { atom, WritableAtom } from 'jotai';
import { loadable } from 'jotai/utils';
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

export const loadablePersonalInfoAtom = loadable(personalInfoAtom);
