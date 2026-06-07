import { Trans, useTranslation } from 'react-i18next';
import { Browser } from '@capacitor/browser';
import { useCallback } from 'react';

const PRIVACY_POLICY_URL = 'https://dietwise.eu/about/recipewatch/myrecipewatch-privacy-policy/';

const TermsContent: React.FC = () => {
	const { t } = useTranslation();
	const onPrivacyPolicyClick = useCallback(async (e: React.MouseEvent) => {
		e.preventDefault();
		await Browser.open({ url: PRIVACY_POLICY_URL });
	}, []);

	return (
		<div className="help ion-padding-horizontal">
			<h2>{t('terms.acceptance.heading')}</h2>
			<p>{t('terms.acceptance.body')}</p>

			<h2>{t('terms.service.heading')}</h2>
			<p>{t('terms.service.body')}</p>

			<h2>{t('terms.eligibility.heading')}</h2>
			<p>{t('terms.eligibility.body')}</p>

			<h2>{t('terms.account.heading')}</h2>
			<p>{t('terms.account.body')}</p>

			<h2>{t('terms.acceptableUse.heading')}</h2>
			<p>{t('terms.acceptableUse.body')}</p>

			<h2>{t('terms.userContent.heading')}</h2>
			<p>{t('terms.userContent.body')}</p>

			<h2>{t('terms.recommendationsDisclaimer.heading')}</h2>
			<p>{t('terms.recommendationsDisclaimer.body')}</p>

			<h2>{t('terms.intellectualProperty.heading')}</h2>
			<p>{t('terms.intellectualProperty.body')}</p>

			<h2>{t('terms.privacy.heading')}</h2>
			<p>
				<Trans
					i18nKey="terms.privacy.body"
					components={{
						policyLink: <a href={PRIVACY_POLICY_URL} onClick={onPrivacyPolicyClick} />,
					}}
				/>
			</p>

			<h2>{t('terms.liability.heading')}</h2>
			<p>{t('terms.liability.body')}</p>

			<h2>{t('terms.changes.heading')}</h2>
			<p>{t('terms.changes.body')}</p>

			<h2>{t('terms.governingLaw.heading')}</h2>
			<p>{t('terms.governingLaw.body')}</p>
		</div>
	);
};

export default TermsContent;
