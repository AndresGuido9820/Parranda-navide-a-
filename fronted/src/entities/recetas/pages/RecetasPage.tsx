import { Check, ChefHat, ChevronDown, ChevronRight, Heart, Plus, Search, Timer } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeCardSkeleton } from '../../../shared/components/skeletons/Skeleton';
import { MainLayout } from '../../../shared/layouts/MainLayout';
import {
  useDeleteRecipe,
  useGetCommunityRecipes,
  useGetFavoriteIds,
  useGetMyFavorites,
  useGetMyRecipes,
  useToggleFavorite,
} from '../services';

// Categories and order options
const CATEGORIES = [
  { value: '', label: 'Todas las categorías' },
  { value: 'postre', label: 'Postres' },
  { value: 'plato principal', label: 'Platos principales' },
  { value: 'entrada', label: 'Entradas' },
  { value: 'bebida', label: 'Bebidas' },
];

const ORDER_OPTIONS = [
  { value: '', label: 'Sin ordenar' },
  { value: 'reciente', label: 'Más recientes' },
  { value: 'nombre', label: 'Por nombre' },
  { value: 'rating', label: 'Mejor rating' },
];

type TabType = 'mis-recetas' | 'comunidad' | 'favoritos';

export const RecetasPage: React.FC = () => {
  const navigate = useNavigate();
  const deleteRecipeMutation = useDeleteRecipe();
  const [filterValue, setFilterValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('mis-recetas');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const categoryRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filterValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [filterValue]);

  // Preparar parámetros para las queries
  const queryParams = useMemo(() => ({
    category: selectedCategory || undefined,
    search: debouncedSearch || undefined,
  }), [selectedCategory, debouncedSearch]);

  // Usar los servicios según el tab activo - ahora con parámetros
  const myRecipesQuery = useGetMyRecipes(queryParams);
  const communityRecipesQuery = useGetCommunityRecipes(queryParams);
  const favoritesQuery = useGetMyFavorites();
  const { data: favoriteIds = [] } = useGetFavoriteIds();
  const { toggle: toggleFavorite, isLoading: isFavoriteLoading } = useToggleFavorite();

  // Seleccionar query según tab
  const currentQuery = activeTab === 'mis-recetas' 
    ? myRecipesQuery 
    : activeTab === 'comunidad' 
      ? communityRecipesQuery 
      : favoritesQuery;
  const allRecipes = currentQuery.data || [];

  // Verificar si una receta está en favoritos
  const isFavorite = (recipeId: string) => favoriteIds.includes(recipeId);

  // Ordenar recetas (filtros ya vienen del backend, excepto para favoritos)
  const filteredRecipes = useMemo(() => {
    let filtered = [...allRecipes];

    // Para favoritos, aplicar filtros locales ya que el endpoint no los soporta
    if (activeTab === 'favoritos') {
      if (filterValue) {
        const searchLower = filterValue.toLowerCase();
        filtered = filtered.filter(
          (recipe) =>
            recipe.title.toLowerCase().includes(searchLower) ||
            recipe.tags?.some((tag) => tag.toLowerCase().includes(searchLower)) ||
            recipe.category?.toLowerCase().includes(searchLower)
        );
      }
      if (selectedCategory) {
        filtered = filtered.filter(
          (recipe) => recipe.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
      }
    }

    // Ordenamiento local (backend no lo soporta)
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
  }, [allRecipes, filterValue, selectedCategory, selectedOrder, activeTab]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Card menu
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId]?.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
      // Category dropdown
      if (isCategoryOpen && categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      // Order dropdown
      if (isOrderOpen && orderRef.current && !orderRef.current.contains(event.target as Node)) {
        setIsOrderOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId, isCategoryOpen, isOrderOpen]);

  // Formatear tiempo
  const formatTime = (minutes: number | null): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
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
      <main className="w-full max-w-6xl mx-auto flex-1 px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col gap-8 animate-fade-in-up">
          
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-3 tracking-tight text-white drop-shadow-xl">
              Recetas
            </h1>
            <p className="text-gray-400 text-lg md:text-xl font-light">
              Explora tus preparaciones y las de la comunidad.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-6">
            
            {/* Tabs */}
            <div className="flex p-1 bg-black/40 backdrop-blur-md rounded-xl w-fit mx-auto border border-white/10">
              <button 
                onClick={() => setActiveTab('mis-recetas')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'mis-recetas' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Mis recetas
              </button>
              <button 
                onClick={() => setActiveTab('comunidad')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'comunidad' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Comunidad
              </button>
              <button 
                onClick={() => setActiveTab('favoritos')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === 'favoritos' 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${activeTab === 'favoritos' ? 'fill-white' : ''}`} />
                Favoritos
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="relative flex-grow group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text" 
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  placeholder="Buscar por nombre o etiqueta..." 
                  className="w-full bg-black/30 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-black/50 transition-all"
                />
              </div>
              <div className="flex gap-3">
                {/* Category Dropdown */}
                <div ref={categoryRef} className="relative">
                  <button
                    onClick={() => {
                      setIsCategoryOpen(!isCategoryOpen);
                      setIsOrderOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 bg-black/30 border rounded-xl text-gray-300 hover:border-red-500/30 transition-all cursor-pointer min-w-[180px] justify-between ${
                      isCategoryOpen ? 'border-red-500/50 bg-black/50' : 'border-white/10'
                    }`}
                  >
                    <span className="text-sm">
                      {CATEGORIES.find(c => c.value === selectedCategory)?.label || 'Categorías'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full min-w-[200px] bg-slate-900/95 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-fade-in">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => {
                            setSelectedCategory(cat.value);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                            selectedCategory === cat.value
                              ? 'bg-red-500/20 text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="text-sm">{cat.label}</span>
                          {selectedCategory === cat.value && (
                            <Check className="w-4 h-4 text-red-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Order Dropdown */}
                <div ref={orderRef} className="relative">
                  <button
                    onClick={() => {
                      setIsOrderOpen(!isOrderOpen);
                      setIsCategoryOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 bg-black/30 border rounded-xl text-gray-300 hover:border-red-500/30 transition-all cursor-pointer min-w-[160px] justify-between ${
                      isOrderOpen ? 'border-red-500/50 bg-black/50' : 'border-white/10'
                    }`}
                  >
                    <span className="text-sm">
                      {ORDER_OPTIONS.find(o => o.value === selectedOrder)?.label || 'Ordenar'}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOrderOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOrderOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full min-w-[180px] bg-slate-900/95 backdrop-blur-xl border border-red-500/30 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-fade-in">
                      {ORDER_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSelectedOrder(opt.value);
                            setIsOrderOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${
                            selectedOrder === opt.value
                              ? 'bg-red-500/20 text-white'
                              : 'text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          <span className="text-sm">{opt.label}</span>
                          {selectedOrder === opt.value && (
                            <Check className="w-4 h-4 text-red-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-gray-500 text-sm">
              Total {filteredRecipes.length} recetas
              {currentQuery.isLoading && ' (cargando...)'}
            </div>
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Create New Card */}
            <div 
              onClick={() => navigate('/recetas/create')}
              className="h-full min-h-[360px] rounded-2xl border-2 border-dashed border-red-500/30 bg-red-950/10 hover:bg-red-900/20 hover:border-red-500/60 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
                <Plus className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">Añadir nueva receta</h3>
                <p className="text-sm text-gray-400">Sube fotos, ingredientes y pasos</p>
              </div>
              <button className="mt-2 px-6 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition-colors">
                Crear
              </button>
            </div>

            {/* Loading Skeletons */}
            {currentQuery.isLoading ? (
              <>
                {[...Array(5)].map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </>
            ) : filteredRecipes.length === 0 ? (
              <div className="col-span-full text-center text-white/60 py-12">
                <p className="text-lg">No se encontraron recetas</p>
                <p className="text-sm mt-2">Intenta con otros filtros o crea una nueva</p>
              </div>
            ) : (
              filteredRecipes.map((receta) => (
                <div
                  key={receta.id}
                  onClick={() => navigate(`/recetas/${receta.id}`)}
                  className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-900/20 transition-all duration-300 flex flex-col h-full min-h-[360px] cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {receta.photo_url ? (
                      <img 
                        src={receta.photo_url} 
                        alt={receta.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-900/50 to-slate-900 flex items-center justify-center">
                        <ChefHat className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    
                    {/* Rating Badge */}
                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white text-sm font-medium flex items-center gap-1">
                      <span className="text-yellow-400">★</span> {receta.rating?.toFixed(1) || 'N/A'}
                    </span>
                    
                    {/* Favorite Button */}
                    <button 
                      className={`absolute top-3 right-3 bg-black/60 backdrop-blur-sm p-2 rounded-full cursor-pointer transition-colors ${
                        isFavorite(receta.id) ? 'bg-red-500/80' : 'hover:bg-red-500/80'
                      }`}
                      disabled={isFavoriteLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(receta.id, isFavorite(receta.id));
                      }}
                    >
                      <Heart 
                        className={`w-4 h-4 transition-colors ${
                          isFavorite(receta.id) ? 'text-red-500 fill-red-500' : 'text-white'
                        }`}
                      />
                    </button>

                    {/* Menu Button for own recipes */}
                    {activeTab === 'mis-recetas' && (
                      <div className="absolute bottom-3 right-3">
                        <button 
                          className="bg-black/60 backdrop-blur-sm p-2 rounded-full text-white/60 hover:text-white hover:bg-red-500/80 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === receta.id ? null : receta.id);
                          }}
                          title="Más opciones"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>
                        {openMenuId === receta.id && (
                          <div
                            ref={(el) => { menuRefs.current[receta.id] = el; }}
                            className="absolute right-0 bottom-full mb-2 w-36 bg-slate-900 border border-red-500/30 rounded-xl shadow-xl z-50 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2 text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(receta.id, receta.title);
                              }}
                              disabled={deleteRecipeMutation.isPending}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              {deleteRecipeMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-red-300 transition-colors">
                      {receta.title}
                    </h3>
                    
                    {/* Tags */}
                    {receta.tags && receta.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {receta.tags.slice(0, 3).map((tag, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-5 mt-auto">
                      <div className="flex items-center gap-1.5">
                        <Timer className="w-4 h-4 text-red-500" />
                        <span>{formatTime(receta.prep_time_minutes)}</span>
                      </div>
                      {receta.yield && (
                        <div className="flex items-center gap-1.5">
                          <ChefHat className="w-4 h-4 text-red-500" />
                          <span>{receta.yield}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Button */}
                    <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-red-600 hover:border-red-500 transition-all flex items-center justify-center gap-2 group/btn">
                      Ver receta
                      <ChevronRight className="w-4 h-4 opacity-50 group-hover/btn:translate-x-1 group-hover/btn:opacity-100 transition-all" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
};
