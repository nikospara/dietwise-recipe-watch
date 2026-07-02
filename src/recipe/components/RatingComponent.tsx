import { TbInfoSquareRounded } from 'react-icons/tb';
import type { Rating } from '@/recipe/model';
import { encouragedRatio, limitedRatio } from '@/recipe/reducers/calculateRating';
import './RatingComponent.css';

export interface RatingComponentProps {
	rating: Rating | undefined;
	max: number;
}

const RatingComponent: React.FC<RatingComponentProps> = (props: RatingComponentProps) => {
	const limited = props.rating ? limitedRatio(props.rating) : 0;
	const encouraged = props.rating ? encouragedRatio(props.rating) : 0;

	return (
		<div className="rating-bipolar">
			<div className="rating-bipolar__track rating-bipolar__track--limited">
				<div
					className="rating-bipolar__fill rating-bipolar__fill--limited"
					style={{ width: `${limited * 100}%` }}
				/>
			</div>
			<TbInfoSquareRounded className="rating-bipolar__center" aria-hidden="true" />
			<div className="rating-bipolar__track rating-bipolar__track--encouraged">
				<div
					className="rating-bipolar__fill rating-bipolar__fill--encouraged"
					style={{ width: `${encouraged * 100}%` }}
				/>
			</div>
		</div>
	);
};

export default RatingComponent;
