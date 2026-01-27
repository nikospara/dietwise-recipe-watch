import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPersonalInfo, savePersonalInfo } from './api';

vi.mock('i18next', () => ({
	t: (key: string) => key,
}));

const apiServerHost = 'http://example.com';
const accessToken = 'token-123';

describe('personalization api', () => {
	beforeEach(() => {
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it('fetchPersonalInfo returns empty object for 204', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 204,
		} as Response);

		const result = await fetchPersonalInfo(apiServerHost, accessToken);

		expect(result).toEqual({});
		expect(fetchMock).toHaveBeenCalledWith(apiServerHost + '/personal-info', {
			signal: undefined,
			headers: {
				Accepts: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});
	});

	it('fetchPersonalInfo returns parsed body for 200', async () => {
		const fetchMock = vi.mocked(fetch);
		const payload = { allergies: ['peanuts'] };
		const json = vi.fn().mockResolvedValue(payload);
		fetchMock.mockResolvedValue({
			status: 200,
			json,
		} as unknown as Response);

		const result = await fetchPersonalInfo(apiServerHost, accessToken);

		expect(result).toEqual(payload);
		expect(json).toHaveBeenCalled();
	});

	it('fetchPersonalInfo throws translated error for 401', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 401,
		} as Response);

		await expect(fetchPersonalInfo(apiServerHost, accessToken)).rejects.toThrowError('error.401');
	});

	it('fetchPersonalInfo throws generic error for other status', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 500,
		} as Response);

		await expect(fetchPersonalInfo(apiServerHost, accessToken)).rejects.toThrowError('error.unknown');
	});

	it('fetchPersonalInfo throws network/system error on fetch failure', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockRejectedValue(new Error('network down'));

		await expect(fetchPersonalInfo(apiServerHost, accessToken)).rejects.toThrowError('error.networkOrSystem');
	});

	it('savePersonalInfo succeeds for 200', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 200,
		} as Response);

		await expect(savePersonalInfo(apiServerHost, accessToken, { gender: 'FEMALE' })).resolves.toBeUndefined();
		expect(fetchMock).toHaveBeenCalledWith(apiServerHost + '/personal-info', {
			method: 'POST',
			body: JSON.stringify({ gender: 'FEMALE' }),
			headers: {
				Accepts: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
		});
	});

	it('savePersonalInfo succeeds for 204', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 204,
		} as Response);

		await expect(savePersonalInfo(apiServerHost, accessToken, {})).resolves.toBeUndefined();
	});

	it('savePersonalInfo throws translated error for 401', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 401,
		} as Response);

		await expect(savePersonalInfo(apiServerHost, accessToken, {})).rejects.toThrowError('error.401');
	});

	it('savePersonalInfo throws generic error for other status', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockResolvedValue({
			status: 418,
		} as Response);

		await expect(savePersonalInfo(apiServerHost, accessToken, {})).rejects.toThrowError('error.unknown');
	});

	it('savePersonalInfo throws network/system error on fetch failure', async () => {
		const fetchMock = vi.mocked(fetch);
		fetchMock.mockRejectedValue(new Error('timeout'));

		await expect(savePersonalInfo(apiServerHost, accessToken, {})).rejects.toThrowError('error.networkOrSystem');
	});
});
