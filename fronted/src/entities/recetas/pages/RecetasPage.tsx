import { Button, Card, CardBody, Chip } from '@heroui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import { FilterSelects } from '../components/FilterSelects';
import { RecipeFilterTabs } from '../components/RecipeFilterTabs';
import { SearchBar } from '../components/SearchBar';
import { useDeleteRecipe, useGetCommunityRecipes, useGetMyRecipes } from '../services';

export const RecetasPage: React.FC = () => {
  const navigate = useNavigate();
  const deleteRecipeMutation = useDeleteRecipe();
  const [filterValue, setFilterValue] = useState('');
  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'comunidad'>('mis-recetas');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Usar los servicios según el tab activo
  const myRecipesQuery = useGetMyRecipes();
  const communityRecipesQuery = useGetCommunityRecipes();

  const currentQuery = activeTab === 'mis-recetas' ? myRecipesQuery : communityRecipesQuery;
  const allRecipes = currentQuery.data || [];

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

  // Filtrar y ordenar recetas
  const filteredRecipes = useMemo(() => {
    let filtered = [...allRecipes];

    // Filtro de búsqueda
    if (filterValue) {
      const searchLower = filterValue.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
          recipe.category?.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de categoría
    if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'Todas') {
      filtered = filtered.filter(
        (recipe) => recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Ordenamiento
    if (selectedOrder) {
      switch (selectedOrder) {
        case 'reciente':
          filtered.sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          break;
        case 'nombre':
          filtered.sort((a, b) => 
            a.title.localeCompare(b.title, 'es', { sensitivity: 'base' })
          );
          break;
        case 'popular':
        case 'rating':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
      }
    }

    return filtered;
  }, [allRecipes, filterValue, selectedCategory, selectedOrder]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId]?.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  // Formatear tiempo
  const formatTime = (minutes: number | null): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Manejar eliminación
  const handleDelete = async (recipeId: string, recipeTitle: string) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${recipeTitle}"?`)) {
      return;
    }

    try {
      await deleteRecipeMutation.mutateAsync(recipeId);
      setOpenMenuId(null);
    } catch (error) {
      console.error('Error al eliminar la receta:', error);
      alert('Error al eliminar la receta. Por favor intenta nuevamente.');
    }
  };

  return (
    <MainLayout>
      <main className="w-full max-w-6xl mx-auto flex-1 px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Recetas</h1>
            <p className="text-white/70 text-sm sm:text-base md:text-lg">
              Explora tus preparaciones y las de la comunidad.
            </p>
          </div>

          <div className="bg-transparent rounded-xl p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="bg-gray-500/30 rounded-lg px-3 sm:px-4 py-2 w-full">
                  <RecipeFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="bg-gray-500/30 rounded-lg px-3 sm:px-4 py-2 flex-1">
                    <SearchBar
                      value={filterValue}
                      onChange={onSearchChange}
                      onClear={onClear}
                      placeholder="Buscar por nombre o etiqueta:"
                    />
                  </div>

                  <div className="bg-gray-500/30 rounded-lg px-3 sm:px-4 py-2 w-full sm:w-auto">
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
                <span className="text-white/60 text-xs sm:text-sm">
                  Total {filteredRecipes.length} recetas
                  {currentQuery.isLoading && ' (cargando...)'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <Card className="bg-transparent backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl hover:border-white/50 transition-all cursor-pointer">
              <CardBody className="flex flex-col items-center justify-center p-6 sm:p-8 min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">+</div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">Añadir nueva receta</h3>
                <p className="text-white/60 text-xs sm:text-sm text-center mb-4 sm:mb-6">
                  Sube fotos, ingredientes y pasos.
                </p>
                <Button 
                  className="bg-red-600 text-white font-bold rounded-full px-6 sm:px-8 py-2 text-sm sm:text-base"
                    onClick={() => navigate('/recetas/create')}
                >
                  Crear
                </Button>
              </CardBody>
            </Card>

            {currentQuery.isLoading ? (
              <div className="col-span-full text-center text-white py-8">
                Cargando recetas...
              </div>
            ) : filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center text-white/60 py-8">
                No se encontraron recetas
              </div>
            ) : (
              filteredRecipes.map((receta) => (
                <Card 
                  key={receta.id} 
                  className="bg-transparent backdrop-blur-sm border border-white/30 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/recetas/${receta.id}`)}
                >
                  <div className="relative">
                    <div className="aspect-video bg-gray-700 w-full relative">
                      {receta.photo_url && (
                        <img 
                          src={receta.photo_url} 
                          alt={receta.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <span className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-sm">
                        ★ {receta.rating?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <CardBody className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 line-clamp-2">{receta.title}</h3>
                      <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                        Tiempo: {formatTime(receta.prep_time_minutes)} · Rinde: {receta.yield || 'N/A'}
                      </p>
                      {receta.tags && receta.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                          {receta.tags.map((tag, idx) => (
                            <Chip key={idx} size="sm" className="bg-red-600/20 text-red-600 border-0 text-xs">
                              {tag}
                            </Chip>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <Button 
                          className="bg-red-600 text-white font-bold flex-1 mr-1 sm:mr-2 rounded-full py-2 text-xs sm:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/recetas/${receta.id}`);
                          }}
                        >
                          Ver receta
                        </Button>
                        {activeTab === 'mis-recetas' && (
                          <div className="relative">
                            <button 
                              className="p-2 text-white/60 hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === receta.id ? null : receta.id);
                              }}
                              title="Más opciones"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </button>
                            {openMenuId === receta.id && (
                              <div
                                ref={(el) => {
                                  menuRefs.current[receta.id] = el;
                                }}
                                className="absolute right-0 bottom-full mb-1 w-40 bg-[#171111] border border-red-500/22 rounded-lg shadow-lg z-50 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(receta.id, receta.title);
                                  }}
                                  disabled={deleteRecipeMutation.isPending}
                                >
                                  <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  <span className={deleteRecipeMutation.isPending ? 'opacity-50' : ''}>
                                    {deleteRecipeMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
