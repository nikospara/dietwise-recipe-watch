import { TbStar, TbStarFilled, TbStarHalfFilled } from 'react-icons/tb';
import type { Rating } from '@/recipe/model';
import { ratingFraction } from '@/recipe/reducers/calculateRating';

export interface RatingComponentProps {
	rating: Rating | undefined;
	max: number;
}

const RatingComponent: React.FC<RatingComponentProps> = (props: RatingComponentProps) => {
	const stars = new Array(props.max);
	const rating = props.rating ? props.max * ratingFraction(props.rating) : 0;

	for (let i = 0; i < props.max; i++) {
		if (rating > i + 0.5) {
			stars.push(<TbStarFilled className="inline-block" key={i} />);
		} else if (rating > i) {
			stars.push(<TbStarHalfFilled className="inline-block" key={i} />);
		} else {
			stars.push(<TbStar className="inline-block" key={i} />);
		}
	}

	return <div className="color-gold">{stars}</div>;
};

export default RatingComponent;
