import type { Recipe, RecipeStep } from '../types/recipe.types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateStepId = (): string => {
  return `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const mockUserId = 'user-1-mock';

// Fechas variadas para las recetas (días diferentes)
const getDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const createRecipeWithSteps = (
  recipeData: Omit<Recipe, 'steps'>,
  stepsData: Omit<RecipeStep, 'id' | 'recipe_id' | 'step_number'>[]
): Recipe => {
  const recipeId = recipeData.id;
  const steps: RecipeStep[] = stepsData.map((step, index) => ({
    ...step,
    id: generateStepId(),
    recipe_id: recipeId,
    step_number: index + 1,
  }));

  return {
    ...recipeData,
    steps,
  };
};

export const mockMyRecipes: Recipe[] = [
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Ponche de Navidad especiado',
      author_user_id: mockUserId,
      author_alias: 'María Navideña',
      photo_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 25,
      yield: '6 vasos',
      category: 'bebidas',
      rating: 4.9,
      tags: ['#bebidas', '#navideño', '#caliente'],
      is_published: true,
      created_at: getDate(5),
      updated_at: getDate(1),
    },
    [
      {
        instruction_md: 'Calienta agua en una olla grande.',
        ingredients_json: ['agua'],
        time_minutes: 5,
      },
      {
        instruction_md: 'Agrega canela, clavo y jengibre. Deja hervir 2 minutos.',
        ingredients_json: ['canela', 'clavo', 'jengibre'],
        time_minutes: 3,
      },
      {
        instruction_md: 'Añade azúcar morena y mezcla hasta disolver.',
        ingredients_json: ['azúcar morena'],
        time_minutes: 8,
      },
      {
        instruction_md: 'Incorpora el jugo de naranja y limón.',
        ingredients_json: ['jugo de naranja', 'jugo de limón'],
        time_minutes: 5,
      },
      {
        instruction_md: 'Sirve caliente con una rodaja de naranja.',
        ingredients_json: ['naranja'],
        time_minutes: 4,
      },
    ]
  ),
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Natilla Navideña de Abuela',
      author_user_id: mockUserId,
      author_alias: 'María Navideña',
      photo_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 90,
      yield: '8 porciones',
      category: 'postres',
      rating: 4.8,
      tags: ['#postres', '#tradicional', '#cremoso'],
      is_published: true,
      created_at: getDate(12),
      updated_at: getDate(3),
    },
    [
      {
        instruction_md: 'Mezcla leche, azúcar y canela en una olla.',
        ingredients_json: ['leche', 'azúcar', 'canela'],
        time_minutes: 10,
      },
      {
        instruction_md: 'Calienta a fuego medio hasta que hierva.',
        ingredients_json: ['leche'],
        time_minutes: 15,
      },
      {
        instruction_md: 'Disuelve maicena en agua fría y agrega a la mezcla.',
        ingredients_json: ['maicena', 'agua'],
        time_minutes: 20,
      },
      {
        instruction_md: 'Cocina revolviendo constantemente hasta espesar.',
        ingredients_json: ['mezcla'],
        time_minutes: 30,
      },
      {
        instruction_md: 'Refrigera por 1 hora antes de servir.',
        ingredients_json: [],
        time_minutes: 15,
      },
    ]
  ),
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Arequipe Casero',
      author_user_id: mockUserId,
      author_alias: 'María Navideña',
      photo_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 60,
      yield: '1 frasco',
      category: 'postres',
      rating: 4.9,
      tags: ['#postres', '#dulce', '#tradicional'],
      is_published: true,
      created_at: getDate(20),
      updated_at: getDate(15),
    },
    [
      {
        instruction_md: 'Calienta leche, azúcar y esencia de vainilla en una olla.',
        ingredients_json: ['leche', 'azúcar', 'vainilla'],
        time_minutes: 10,
      },
      {
        instruction_md: 'Revuelve constantemente hasta que espese.',
        ingredients_json: [],
        time_minutes: 45,
      },
      {
        instruction_md: 'Retira del fuego y deja enfriar.',
        ingredients_json: [],
        time_minutes: 5,
      },
    ]
  ),
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Chocolate Caliente Especial',
      author_user_id: mockUserId,
      author_alias: 'María Navideña',
      photo_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 15,
      yield: '4 tazas',
      category: 'bebidas',
      rating: 4.7,
      tags: ['#bebidas', '#chocolate', '#caliente'],
      is_published: true,
      created_at: getDate(2),
      updated_at: getDate(0),
    },
    [
      {
        instruction_md: 'Calienta leche con chocolate en barra.',
        ingredients_json: ['leche', 'chocolate'],
        time_minutes: 5,
      },
      {
        instruction_md: 'Agrega azúcar y canela.',
        ingredients_json: ['azúcar', 'canela'],
        time_minutes: 5,
      },
      {
        instruction_md: 'Sirve caliente con malvaviscos.',
        ingredients_json: ['malvaviscos'],
        time_minutes: 5,
      },
    ]
  ),
];

