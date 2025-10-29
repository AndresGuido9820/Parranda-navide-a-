import { Button, Card, CardBody, Chip } from '@heroui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { FilterSelects } from '../components/FilterSelects';
import { RecipeFilterTabs } from '../components/RecipeFilterTabs';
import { SearchBar } from '../components/SearchBar';

const recetas = [
  {
    id: 1,
    nombre: 'Ponche de Navidad especiado',
    rating: 4.9,
    tiempo: '25m',
    yield: '6 vasos',
    tags: ['#bebidas'],
    image: 'https://lh3.googleusercontent.com/placeholder',
    categoria: 'Bebidas'
  },
  {
    id: 2,
    nombre: 'Natilla Navideña de Abuela',
    rating: 4.8,
    tiempo: '1h 30m',
    yield: '8 porciones',
    tags: ['#postres', '#tradicional'],
    image: 'https://lh3.googleusercontent.com/placeholder',
    categoria: 'Postres'
  },
  {
    id: 3,
    nombre: 'Buñuelos',
    rating: 4.7,
    tiempo: '45m',
    yield: '12 unidades',
    tags: ['#postres'],
    image: 'https://lh3.googleusercontent.com/placeholder',
    categoria: 'Postres'
  },
  {
    id: 4,
    nombre: 'Lechona',
    rating: 4.6,
    tiempo: '4 horas',
    yield: '10 porciones',
    tags: ['#platos-principales'],
    image: 'https://lh3.googleusercontent.com/placeholder',
    categoria: 'Platos principales'
  },
];

export const RecetasPage: React.FC = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('');
  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'comunidad'>('mis-recetas');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
  }, []);

  return (
    <MainLayout>
      <main className="w-full max-w-6xl mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">Recetas</h1>
            <p className="text-white/70 text-lg">
              Explora tus preparaciones y las de la comunidad.
            </p>
          </div>

          <div className="bg-transparent rounded-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="bg-gray-500/30 rounded-lg px-4 py-2">
                  <RecipeFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                <div className="flex gap-4 items-center">
                  <div className="bg-gray-500/30 rounded-lg px-4 py-2">
                    <SearchBar
                      value={filterValue}
                      onChange={onSearchChange}
                      onClear={onClear}
                      placeholder="Buscar por nombre o etiqueta:"
                    />
                  </div>

                  <div className="bg-gray-500/30 rounded-lg px-4 py-2">
                    <FilterSelects
                      selectedCategory={selectedCategory}
                      selectedOrder={selectedOrder}
                      onCategoryChange={setSelectedCategory}
                      onOrderChange={setSelectedOrder}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-small">Total {recetas.length} recetas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-transparent backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 transition-all cursor-pointer">
              <CardBody className="flex flex-col items-center justify-center p-8 min-h-[400px]">
                <div className="text-6xl mb-4">+</div>
                <h3 className="text-xl font-bold text-white mb-2">Añadir nueva receta</h3>
                <p className="text-white/60 text-sm text-center mb-6">
                  Sube fotos, ingredientes y pasos.
                </p>
                <Button 
                  className="bg-red-600 text-white font-bold rounded-full px-8 py-2"
                    onClick={() => navigate('/recetas/create')}
                >
                  Crear
                </Button>
              </CardBody>
            </Card>

            {recetas.map((receta) => (
              <Card 
                key={receta.id} 
                className="bg-transparent backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => navigate(`/recetas/${receta.id}`)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-700 w-full relative">
                    <span className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                      ★ {receta.rating}
                    </span>
                    
                  </div>
                  <CardBody className="p-5">
                    <h3 className="text-lg font-bold text-white mb-3">{receta.nombre}</h3>
                    <p className="text-sm text-white/60 mb-4">
                      Tiempo: {receta.tiempo} · Rinde: {receta.yield}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {receta.tags.map((tag, idx) => (
                        <Chip key={idx} size="sm" className="bg-red-600/20 text-red-600 border-0">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Button 
                        className="bg-red-600 text-white font-bold flex-1 mr-2 rounded-full py-2"
                        onClick={() => navigate(`/recetas/${receta.id}`)}
                      >
                        Ver receta
                      </Button>
                      <div className="flex gap-2">
                        <button className="p-2 text-white/60 hover:text-white">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button className="p-2 text-white/60 hover:text-white">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </CardBody>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
