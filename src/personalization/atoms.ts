import { atom, WritableAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { PersonalInfo } from './model';
import { accessTokenAtom } from 'auth/atoms';
import { apiServerHostAtom } from 'settings/atoms';
import { t } from 'i18next';

// TODO Use atomWithRefresh: https://jotai.org/docs/utilities/resettable#atomwithrefresh
export const personalInfoAtom: WritableAtom<Promise<PersonalInfo>, [PersonalInfo], Promise<void>> = atom(
	async (get, { signal }) => {
		const accessToken = await get(accessTokenAtom);
		if (typeof accessToken === 'string') {
			try {
				const apiServerHost = get(apiServerHostAtom);
				const response = await fetch(apiServerHost + '/personal-info', {
					signal,
					headers: {
						Accepts: 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (response.status === 204) return {};
				if (response.status === 200) {
					const personalInfo = (await response.json()) as PersonalInfo;
					return personalInfo;
				}
				if (response.status === 401) {
					console.error('Unauthenticated to fetch personal info');
					throw new Error(t('error.401'));
				}
				console.error(`HTTP error ${response.status} to fetch personal info`);
				throw new Error(t('error.unknown'));
			} catch (e) {
				console.error('Error fetching personal info', e);
				throw new Error(t('error.networkOrSystem'));
			}
		}
		return {};
	},
	async (get, _set, value: PersonalInfo) => {
		const accessToken = await get(accessTokenAtom);
		if (typeof accessToken === 'string') {
			try {
				const apiServerHost = get(apiServerHostAtom);
				const response = await fetch(apiServerHost + '/personal-info', {
					method: 'POST',
					body: JSON.stringify(value),
					headers: {
						Accepts: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
				});
				if (response.status === 204 || response.status === 200) {
					return;
				}
				if (response.status === 401) {
					console.error('Unauthenticated to save personal info');
					throw new Error(t('error.401'));
				}
				console.error(`HTTP error ${response.status} to save personal info`);
				throw new Error(t('error.unknown'));
			} catch (e) {
				console.error('Error saving personal info', e);
				throw new Error(t('error.networkOrSystem'));
			}
		}
	},
);

export const loadablePersonalInfoAtom = loadable(personalInfoAtom);
