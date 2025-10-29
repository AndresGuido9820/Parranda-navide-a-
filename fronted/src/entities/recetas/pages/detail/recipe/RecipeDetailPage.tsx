import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../../../../../shared/layouts/MainLayout';

export interface RecipeDetailData {
  id: number;
  nombre: string;
  subtitle?: string;
  tiempo: string;
  yield: string;
  tags: string[];
  image: string;
  categoria: string;
  rating: number;
  steps: RecipeStep[];
}

export interface RecipeStep {
  minutes: number;
  text: string;
  tags: string[];
}

// Datos de ejemplo - en producción vendrían del backend
const recipeDetails: { [key: number]: RecipeDetailData } = {
  1: {
    id: 1,
    nombre: 'Ponche de Navidad especiado',
    subtitle: 'Bebida caliente tradicional con especias aromáticas.',
    tiempo: '25m',
    yield: '6 vasos',
    tags: ['#bebidas'],
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=1600&auto=format&fit=crop',
    categoria: 'Bebidas',
    rating: 4.9,
    steps: [
      { minutes: 5, text: 'Calienta agua en una olla grande.', tags: ['agua'] },
      { minutes: 3, text: 'Agrega canela, clavo y jengibre. Deja hervir 2 minutos.', tags: ['canela', 'clavo', 'jengibre'] },
      { minutes: 8, text: 'Añade azúcar morena y mezcla hasta disolver.', tags: ['azúcar morena'] },
      { minutes: 5, text: 'Incorpora el jugo de naranja y limón.', tags: ['jugo de naranja', 'jugo de limón'] },
      { minutes: 4, text: 'Sirve caliente con una rodaja de naranja.', tags: ['naranja'] }
    ]
  },
  2: {
    id: 2,
    nombre: 'Natilla Navideña de Abuela',
    subtitle: 'Postre tradicional cremoso con canela y nuez moscada.',
    tiempo: '1h 30m',
    yield: '8 porciones',
    tags: ['#postres', '#tradicional'],
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1600&auto=format&fit=crop',
    categoria: 'Postres',
    rating: 4.8,
    steps: [
      { minutes: 10, text: 'Mezcla leche, azúcar y canela en una olla.', tags: ['leche', 'azúcar', 'canela'] },
      { minutes: 15, text: 'Calienta a fuego medio hasta que hierva.', tags: ['leche'] },
      { minutes: 20, text: 'Disuelve maicena en agua fría y agrega a la mezcla.', tags: ['maicena', 'agua'] },
      { minutes: 30, text: 'Cocina revolviendo constantemente hasta espesar.', tags: ['mezcla'] },
      { minutes: 15, text: 'Refrigera por 1 hora antes de servir.', tags: ['refrigeración'] }
    ]
  },
  3: {
    id: 3,
    nombre: 'Buñuelos',
    subtitle: 'Tradicionales y crujientes por fuera, esponjosos por dentro.',
    tiempo: '45m',
    yield: '12 unidades',
    tags: ['#postres'],
    image: 'https://images.unsplash.com/photo-1604908554027-41a3b8616d1b?q=80&w=1600&auto=format&fit=crop',
    categoria: 'Postres',
    rating: 4.7,
    steps: [
      { minutes: 4, text: 'Mezcla harina, polvo para hornear, sal y azúcar.', tags: ['harina', 'polvo para hornear', 'sal', 'azúcar'] },
      { minutes: 6, text: 'Agrega el huevo, la leche y la mantequilla derretida. Mezcla hasta obtener una masa homogénea.', tags: ['huevo', 'leche', 'mantequilla'] },
      { minutes: 8, text: 'Calienta el aceite a fuego medio.', tags: ['aceite'] },
      { minutes: 10, text: 'Vierte porciones de masa con una cuchara y fríe hasta dorar por ambos lados.', tags: ['masa', 'aceite'] },
      { minutes: 2, text: 'Escurre sobre papel absorbente y espolvorea con azúcar y canela.', tags: ['azúcar', 'canela'] }
    ]
  },
  4: {
    id: 4,
    nombre: 'Lechona',
    subtitle: 'Plato principal tradicional con cerdo y arroz.',
    tiempo: '4 horas',
    yield: '10 porciones',
    tags: ['#platos-principales'],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop',
    categoria: 'Platos principales',
    rating: 4.6,
    steps: [
      { minutes: 30, text: 'Prepara el cerdo marinándolo con especias.', tags: ['cerdo', 'especias'] },
      { minutes: 45, text: 'Cocina el arroz con cebolla y ajo.', tags: ['arroz', 'cebolla', 'ajo'] },
      { minutes: 120, text: 'Asa el cerdo en horno a temperatura media.', tags: ['cerdo', 'horno'] },
      { minutes: 30, text: 'Mezcla el cerdo cocido con el arroz.', tags: ['cerdo', 'arroz'] },
      { minutes: 15, text: 'Sirve caliente con ensalada.', tags: ['ensalada'] }
    ]
  }
};

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const recipeId = id ? parseInt(id) : 1;
  const recipe = recipeDetails[recipeId];

  if (!recipe) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Receta no encontrada</h1>
            <button
              onClick={() => navigate('/recetas')}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Volver a Recetas
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleBackToRecipes = () => {
    navigate('/recetas');
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#160a0a] bg-gradient-to-b from-[#160a0a] via-[#160a0a] to-[#160a0a]">
        <div className="w-full max-w-[920px] mx-auto px-4 py-7 pb-24">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto] gap-4 items-start mb-3">
            <div>
              <h1 className="text-[40px] font-bold text-[#f4f2f2] mb-1 tracking-wide">
                {recipe.nombre}
              </h1>
              <p className="text-[#cbbfbf] mb-1">
                {recipe.subtitle || `${recipe.categoria} tradicional navideño.`}
              </p>
              <div className="flex gap-4 items-center text-[#e8e0e0] opacity-90 text-sm">
                <div className="flex items-center gap-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="9" stroke="#eadede" strokeWidth="1.6"/>
                    <path d="M12 7v5l3 2" stroke="#eadede" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  <span>{recipe.tiempo}</span>
                </div>
                <div className="w-1 h-1 bg-[#7b6e6e] rounded-full opacity-80"></div>
                <span>{recipe.yield}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleBackToRecipes}
                className="h-11 px-4 bg-transparent border border-white/8 text-white rounded-full hover:bg-white/5 transition-colors text-sm font-medium"
              >
                ← Volver
              </button>
              <button
                onClick={handleDownloadPDF}
                className="h-11 inline-flex items-center gap-2 px-4 rounded-full text-white bg-[#e74a3b] border border-white/6 shadow-[0_10px_26px_rgba(231,74,59,0.35)] font-bold cursor-pointer hover:shadow-[0_12px_30px_rgba(231,74,59,0.45)] active:bg-[#c83e31] transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v10m0 0l-3-3m3 3l3-3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="4" y="13" width="16" height="8" rx="2" stroke="#fff" strokeWidth="1.6"/>
                </svg>
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-3 bg-[#1c1010] p-2 rounded-[22px] border border-red-500/22 shadow-[0_28px_60px_rgba(0,0,0,0.6)]">
            <img
              src={recipe.image}
              alt={`Foto de ${recipe.nombre}`}
              className="w-full rounded-[18px] h-auto object-cover"
            />
          </div>

          {/* Divider */}
          <hr className="h-px border-none bg-gradient-to-r from-white/4 via-white/12 to-white/4 my-4" />

          {/* Steps Section */}
          <section className="mt-4">
            <h2 className="text-lg font-bold text-[#f4f2f2] mb-2 mt-5">Preparación (pasos)</h2>
            <ol className="list-none p-0 m-2 mt-0 flex flex-col gap-4">
              {recipe.steps.map((step, index) => (
                <li
                  key={index}
                  className="bg-transparent rounded-xl p-2 border border-transparent hover:border-white/6 hover:bg-white/2 transition-all"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#291515] text-[#f0e0e0] font-extrabold border border-white/8 text-sm">
                      {index + 1}
                    </div>
                    <div className="text-[#efe8e8]">{step.text}</div>
                    <div className="justify-self-end px-2 py-1 text-xs text-[#eadfdf] bg-[#2a2727] border border-white/8 rounded-full">
                      {step.minutes} min
                    </div>
                    {step.tags.length > 0 && (
                      <div className="col-start-2 col-end-3 flex flex-wrap gap-2 mt-1">
                        {step.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="bg-[#2a1717] border border-white/8 text-[#f2d7d7] text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
