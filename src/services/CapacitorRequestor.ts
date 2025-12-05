import { Requestor } from '@openid/appauth';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { XhrSettings } from 'ionic-appauth/lib/cordova';

export class CapacitorRequestor implements Requestor {
	public async xhr<T>(settings: XhrSettings): Promise<T> {
		const response: HttpResponse = await CapacitorHttp.request({
			method: settings.method ? settings.method : 'GET',
			url: settings.url,
			headers: settings.headers,
			data: settings.data,
		});
		return response.data as T;
	}
}
