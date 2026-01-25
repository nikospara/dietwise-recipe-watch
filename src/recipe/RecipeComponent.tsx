import type { Recipe } from 'recipe/model';

export interface RecipeComponentProps {
	recipe: Recipe;
}

const RecipeComponent: React.FC<RecipeComponentProps> = (props: RecipeComponentProps) => {
	return (
		<section>
			{props.recipe.name ? <h2>{props.recipe.name}</h2> : null}
			{props.recipe.text ? <pre className="text-pre-wrap">{props.recipe.text}</pre> : null}
		</section>
	);
};

export default RecipeComponent;
