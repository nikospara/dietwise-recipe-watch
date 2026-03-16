import { IonIcon } from '@ionic/react';
import { checkmark, close } from 'ionicons/icons';
import './HelpContentsComponent.css';

const HelpContentsComponent: React.FC = () => {
	return (
		<div className="help ion-padding-horizontal">
			<p>
				Click in the area at the top of the page and enter the web address of the page containing the recipe you
				are interested in assessing. Then click the "Assess" button. The system will begin assessing the recipe.
			</p>
			<p>
				The assessment takes place in two steps: (1) extract the recipe from the page and (2) suggest
				alternative, healthier and/or more sustainable ingredients. The application displays the list of
				ingredients in the top half of the page and the suggestions in the bottom half.
			</p>
			<p>When browsing suggestions, you have three options:</p>
			<ol>
				<li className="ion-margin-vertical">Leave the suggestion undecided</li>
				<li className="ion-margin-vertical">
					<span className="ion-display-inline-flex ion-align-items-center gap-10px">
						<span>Approve the suggestion - press </span>
						<span className="sim-button sim-button-success">
							<IonIcon icon={checkmark} color="success" />
						</span>
					</span>
				</li>
				<li className="ion-margin-vertical">
					<span className="ion-display-inline-flex ion-align-items-center gap-10px">
						<span>Reject the suggestion - press </span>
						<span className="sim-button sim-button-warn">
							<IonIcon icon={close} color="warning" />
						</span>
					</span>
				</li>
			</ol>
			<p>Press an activated button ("Approve" or "Reject") again to switch a suggestion to undecided.</p>
			<p>
				Another way to switch a suggestion to undecided is to click the "minus" button of a replaced ingredient
				in the recipe in the top half of the page.
			</p>
			<p>
				The application displays statistics about a suggestion near the "Approve" / "Reject" buttons, for the
				current user and all the users in total. The text looks like "User: 1/2/3", where 1 is the number of
				times this suggestion is accepted, 2is the number of times this suggestion is rejected and 3 the number
				of times this suggestion has been proposed.
			</p>
		</div>
	);
};

export default HelpContentsComponent;
