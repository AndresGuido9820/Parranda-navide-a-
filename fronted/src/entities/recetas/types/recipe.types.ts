// Ingredient can be a string or an object with name and amount
export type Ingredient = string | { name?: string; amount?: string };

export interface RecipeStep {
  id: string;
  recipe_id: string;
  step_number: number;
  instruction_md: string;
  ingredients_json: Ingredient[]; // Can be string[] or {name, amount}[]
  time_minutes?: number;
}

export interface Recipe {
  id: string;
  title: string;
  author_user_id: string | null;
  author_alias: string | null;
  photo_url: string | null;
  prep_time_minutes: number | null;
  yield?: string;
  category?: string;
  rating?: number;
  tags?: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  steps?: RecipeStep[];
}

export interface RecipeResponse extends Recipe {
  steps: RecipeStep[];
}

export interface CreateRecipeRequest {
  title: string;
  author_alias: string;
  photo_url?: string | null;
  prep_time_minutes: number;
  yield?: string;
  category?: string;
  tags?: string[];
  steps: Omit<RecipeStep, 'id' | 'recipe_id' | 'step_number'>[];
  photo_file?: File;
}

export interface UpdateRecipeRequest extends CreateRecipeRequest {
  // Por ahora es igual que CreateRecipeRequest, pero podría tener campos adicionales
}

