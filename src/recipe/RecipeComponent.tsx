import type { Recipe } from 'recipe/model';

export interface RecipeComponentProps {
	recipe: Recipe;
}

const RecipeComponent: React.FC<RecipeComponentProps> = (props: RecipeComponentProps) => {
	return (
		<section>
			{props.recipe.name ? <h2>{props.recipe.name}</h2> : null}
			{props.recipe.recipeIngredients?.length > 0 ? (
				<>
					<h3>Ingredients</h3>
					<ul>
						{props.recipe.recipeIngredients.map((ingredient, index) => (
							<li key={index}>{ingredient}</li>
						))}
					</ul>
				</>
			) : props.recipe.text ? (
				<pre className="text-pre-wrap">{props.recipe.text}</pre>
			) : null}
		</section>
	);
	// TODO We could have an accordeon or something similar to display the entire, pristine recipe
	// TODO Maybe this would give the user the opportunity to edit it
	// TODO After editing, allow reset or re-assess
};

export default RecipeComponent;
