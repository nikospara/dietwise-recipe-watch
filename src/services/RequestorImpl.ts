import { isPlatform } from '@ionic/react';
import { CapacitorRequestor } from './CapacitorRequestor';
import { FetchRequestor, Requestor } from '@openid/appauth';

export interface RequestorDefaultConstructor {
	new (): Requestor;
}

// Why only ios??? - see https://github.com/wi3land/ionic-appauth/blob/master/demos/react/src/services/AuthService.ts
export const RequestorImpl: RequestorDefaultConstructor = isPlatform('ios') ? CapacitorRequestor : FetchRequestor;
