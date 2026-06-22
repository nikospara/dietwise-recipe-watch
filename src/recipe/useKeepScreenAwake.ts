import { useEffect, useState } from 'react';
import { useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { KeepAwake } from '@capacitor-community/keep-awake';

// Holds the device screen awake while `active` is true and the hosting Ionic view is in the
// foreground, releasing it as soon as either stops being true. The screen-on flag only takes
// effect on Android/iOS; on the web build this is a no-op so the toggle can still be demoed.
export function useKeepScreenAwake(active: boolean): void {
	const [viewVisible, setViewVisible] = useState(true);
	useIonViewWillEnter(() => setViewVisible(true));
	useIonViewWillLeave(() => setViewVisible(false));

	useEffect(() => {
		if (!Capacitor.isNativePlatform() || !active || !viewVisible) {
			return;
		}
		KeepAwake.keepAwake();
		return () => {
			KeepAwake.allowSleep();
		};
	}, [active, viewVisible]);
}
