import type { Recipe, RecipeStep } from '../types/recipe.types';

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generateStepId = (): string => {
  return `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Fechas variadas para las recetas (días diferentes)
const getDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

const createRecipeWithSteps = (
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

export const mockCommunityRecipes: Recipe[] = [
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Buñuelos',
      author_user_id: 'user-2-mock',
      author_alias: 'Chef Navideño',
      photo_url: 'https://images.unsplash.com/photo-1604908554027-41a3b8616d1b?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 45,
      yield: '12 unidades',
      category: 'postres',
      rating: 4.7,
      tags: ['#postres', '#frito', '#tradicional'],
      is_published: true,
      created_at: getDate(8),
      updated_at: getDate(6),
    },
    [
      {
        instruction_md: 'Mezcla harina, polvo para hornear, sal y azúcar.',
        ingredients_json: ['harina', 'polvo para hornear', 'sal', 'azúcar'],
        time_minutes: 4,
      },
      {
        instruction_md: 'Agrega el huevo, la leche y la mantequilla derretida. Mezcla hasta obtener una masa homogénea.',
        ingredients_json: ['huevo', 'leche', 'mantequilla'],
        time_minutes: 6,
      },
      {
        instruction_md: 'Calienta el aceite a fuego medio.',
        ingredients_json: ['aceite'],
        time_minutes: 8,
      },
      {
        instruction_md: 'Vierte porciones de masa con una cuchara y fríe hasta dorar por ambos lados.',
        ingredients_json: ['masa', 'aceite'],
        time_minutes: 10,
      },
      {
        instruction_md: 'Escurre sobre papel absorbente y espolvorea con azúcar y canela.',
        ingredients_json: ['azúcar', 'canela'],
        time_minutes: 2,
      },
    ]
  ),
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Lechona',
      author_user_id: null,
      author_alias: 'Receta Comunidad',
      photo_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 240,
      yield: '10 porciones',
      category: 'platos',
      rating: 4.6,
      tags: ['#platos-principales', '#tradicional', '#cerdo'],
      is_published: true,
      created_at: getDate(30),
      updated_at: getDate(25),
    },
    [
      {
        instruction_md: 'Prepara el cerdo marinándolo con especias.',
        ingredients_json: ['cerdo', 'especias'],
        time_minutes: 30,
      },
      {
        instruction_md: 'Cocina el arroz con cebolla y ajo.',
        ingredients_json: ['arroz', 'cebolla', 'ajo'],
        time_minutes: 45,
      },
      {
        instruction_md: 'Asa el cerdo en horno a temperatura media.',
        ingredients_json: ['cerdo', 'horno'],
        time_minutes: 120,
      },
      {
        instruction_md: 'Mezcla el cerdo cocido con el arroz.',
        ingredients_json: ['cerdo', 'arroz'],
        time_minutes: 30,
      },
      {
        instruction_md: 'Sirve caliente con ensalada.',
        ingredients_json: ['ensalada'],
        time_minutes: 15,
      },
    ]
  ),
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Arroz con Leche Navideño',
      author_user_id: null,
      author_alias: 'Comunidad Navideña',
      photo_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 40,
      yield: '6 porciones',
      category: 'postres',
      rating: 4.5,
      tags: ['#postres', '#arroz', '#leche'],
      is_published: true,
      created_at: getDate(15),
      updated_at: getDate(10),
    },
    [
      {
        instruction_md: 'Hierve arroz con leche y canela.',
        ingredients_json: ['arroz', 'leche', 'canela'],
        time_minutes: 20,
      },
      {
        instruction_md: 'Agrega azúcar y cocina hasta espesar.',
        ingredients_json: ['azúcar'],
        time_minutes: 15,
      },
      {
        instruction_md: 'Decora con canela en polvo.',
        ingredients_json: ['canela'],
        time_minutes: 5,
      },
    ]
  ),
  createRecipeWithSteps(
    {
      id: generateId(),
      title: 'Tamales Navideños',
      author_user_id: 'user-2-mock',
      author_alias: 'Chef Navideño',
      photo_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
      prep_time_minutes: 180,
      yield: '20 unidades',
      category: 'platos',
      rating: 4.8,
      tags: ['#platos-principales', '#tradicional', '#masa'],
      is_published: true,
      created_at: getDate(18),
      updated_at: getDate(12),
    },
    [
      {
        instruction_md: 'Prepara la masa con maíz molido y manteca.',
        ingredients_json: ['maíz', 'manteca'],
        time_minutes: 30,
      },
      {
        instruction_md: 'Prepara el relleno con carne, verduras y especias.',
        ingredients_json: ['carne', 'verduras', 'especias'],
        time_minutes: 45,
      },
      {
        instruction_md: 'Envuelve la masa con el relleno en hojas de plátano.',
        ingredients_json: ['hojas de plátano'],
        time_minutes: 30,
      },
      {
        instruction_md: 'Cocina al vapor por 1 hora.',
        ingredients_json: [],
        time_minutes: 60,
      },
    ]
  ),
];

