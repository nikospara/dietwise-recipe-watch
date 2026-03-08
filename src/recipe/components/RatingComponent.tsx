import { TbStar, TbStarFilled, TbStarHalfFilled } from 'react-icons/tb';

export interface RatingComponentProps {
	rating: number | undefined;
	max: number;
}

const RatingComponent: React.FC<RatingComponentProps> = (props: RatingComponentProps) => {
	const stars = new Array(props.max);
	const rating = typeof props.rating === 'number' ? props.rating : 0;

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
