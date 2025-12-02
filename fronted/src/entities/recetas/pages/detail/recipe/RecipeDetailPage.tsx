import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@heroui/react';
import { MainLayout } from '../../../../../shared/layouts/MainLayout';
import { Skeleton } from '../../../../../shared/components/skeletons/Skeleton';
import { useAuth } from '../../../../auth';
import { useDownloadRecipePDF, useGetRecipeById, useUpdateRecipe } from '../../../services';
import type { UpdateRecipeRequest } from '../../../types/recipe.types';

export const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: recipe, isLoading, isError } = useGetRecipeById(id);
  const { downloadPDF, isGenerating } = useDownloadRecipePDF();
  const updateRecipeMutation = useUpdateRecipe();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<UpdateRecipeRequest | null>(null);
  
  // Inicializar datos editados cuando se carga la receta
  useEffect(() => {
    if (recipe && !editedData) {
      setEditedData({
        title: recipe.title,
        author_alias: recipe.author_alias || '',
        photo_url: recipe.photo_url,
        prep_time_minutes: recipe.prep_time_minutes || 0,
        yield: recipe.yield,
        category: recipe.category,
        tags: recipe.tags || [],
        steps: recipe.steps?.map(step => ({
          instruction_md: step.instruction_md,
          ingredients_json: step.ingredients_json || [],
          time_minutes: step.time_minutes,
        })) || [],
      });
    }
  }, [recipe, editedData]);

  // Calcular tiempo total basado en los pasos cuando se editan
  useEffect(() => {
    if (isEditing && editedData) {
      const totalTime = editedData.steps.reduce((sum, step) => {
        return sum + (step.time_minutes || 0);
      }, 0);
      
      // Actualizar el tiempo total automáticamente
      setEditedData(prev => {
        if (!prev) return prev;
        if (prev.prep_time_minutes !== totalTime) {
          return { ...prev, prep_time_minutes: totalTime };
        }
        return prev;
      });
    }
  }, [editedData?.steps.map(s => s.time_minutes).join(',')]);

  // Formatear tiempo
  const formatTime = (minutes: number | null): string => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <main className="w-full max-w-4xl mx-auto flex-1 px-4 py-8">
          <div className="flex flex-col gap-6">
            {/* Image skeleton */}
            <Skeleton variant="rounded" height={300} className="w-full" />
            
            {/* Title and meta */}
            <div className="space-y-4">
              <Skeleton variant="text" height={36} width="70%" />
              <div className="flex gap-4">
                <Skeleton variant="text" height={20} width={100} />
                <Skeleton variant="text" height={20} width={80} />
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <Skeleton variant="rounded" height={28} width={70} />
              <Skeleton variant="rounded" height={28} width={90} />
              <Skeleton variant="rounded" height={28} width={60} />
            </div>

            {/* Steps */}
            <div className="space-y-4 mt-6">
              <Skeleton variant="text" height={28} width="30%" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white/5 rounded-lg p-4 space-y-3">
                  <Skeleton variant="text" height={20} width="20%" />
                  <Skeleton variant="text" height={16} width="100%" />
                  <Skeleton variant="text" height={16} width="80%" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </MainLayout>
    );
  }

  if (isError || !recipe) {
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

  const handleDownloadPDF = async () => {
    await downloadPDF(recipe);
  };

  const handleBackToRecipes = () => {
    navigate('/recetas');
  };

  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    if (recipe) {
      setEditedData({
        title: recipe.title,
        author_alias: recipe.author_alias || '',
        photo_url: recipe.photo_url,
        prep_time_minutes: recipe.prep_time_minutes || 0,
        yield: recipe.yield,
        category: recipe.category,
        tags: recipe.tags || [],
        steps: recipe.steps?.map(step => ({
          instruction_md: step.instruction_md,
          ingredients_json: step.ingredients_json || [],
          time_minutes: step.time_minutes,
        })) || [],
      });
    }
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    if (!id || !editedData) return;
    
    // El tiempo total ya está calculado automáticamente por el useEffect
    try {
      await updateRecipeMutation.mutateAsync({
        recipeId: id,
        data: editedData,
      });
      setIsEditing(false);
      // Los datos se refrescarán automáticamente gracias a la invalidación de queries
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Error al guardar los cambios. Por favor intenta nuevamente.');
    }
  };

  const handleAddStep = () => {
    if (!editedData) return;
    
    setEditedData({
      ...editedData,
      steps: [
        ...editedData.steps,
        {
          instruction_md: '',
          ingredients_json: [],
          time_minutes: undefined,
        },
      ],
    });
  };

  const handleRemoveStep = (stepIndex: number) => {
    if (!editedData) return;
    
    const updatedSteps = editedData.steps.filter((_, index) => index !== stepIndex);
    setEditedData({
      ...editedData,
      steps: updatedSteps,
    });
  };

  // Verificar si la receta pertenece al usuario actual
  const isOwner = recipe && user ? recipe.author_user_id === user.id : false;

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#160a0a] bg-gradient-to-b from-[#160a0a] via-[#160a0a] to-[#160a0a]">
        <div className="w-full max-w-[920px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-7 pb-16 sm:pb-20 md:pb-24">
          {/* Header */}
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4 items-start mb-3">
            <div>
              {isEditing && editedData ? (
                <>
                  <input
                    type="text"
                    value={editedData.title}
                    onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                    className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#f4f2f2] mb-1 tracking-wide w-full bg-[#1c1010] border border-white/20 rounded-lg px-3 py-2 focus:border-[#f7a940]/55 focus:ring-2 focus:ring-[#f7a940]/12 outline-none"
                  />
                  <input
                    type="text"
                    value={editedData.category || ''}
                    onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
                    placeholder="Categoría"
                    className="text-[#cbbfbf] mb-1 w-full bg-[#1c1010] border border-white/20 rounded-lg px-3 py-2 focus:border-[#f7a940]/55 focus:ring-2 focus:ring-[#f7a940]/12 outline-none"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center text-[#e8e0e0] opacity-90 text-xs sm:text-sm">
                    <div className="flex items-center gap-1 flex-wrap">
                      <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="#eadede" strokeWidth="1.6"/>
                        <path d="M12 7v5l3 2" stroke="#eadede" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="number"
                        value={editedData.prep_time_minutes || 0}
                        readOnly
                        className="w-16 sm:w-20 bg-[#1c1010]/50 border border-white/20 rounded-lg px-2 py-1 text-[#e8e0e0] opacity-75 text-xs sm:text-sm"
                      />
                      <span className="hidden sm:inline">min (calculado automáticamente)</span>
                      <span className="sm:hidden">min</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-[#7b6e6e] rounded-full opacity-80"></div>
                    <input
                      type="text"
                      value={editedData.yield || ''}
                      onChange={(e) => setEditedData({ ...editedData, yield: e.target.value })}
                      placeholder="Rinde"
                      className="bg-[#1c1010] border border-white/20 rounded-lg px-2 py-1 text-[#e8e0e0] focus:border-[#f7a940]/55 focus:ring-2 focus:ring-[#f7a940]/12 outline-none text-xs sm:text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#f4f2f2] mb-1 tracking-wide">
                    {recipe.title}
                  </h1>
                  <p className="text-[#cbbfbf] mb-1">
                    {recipe.category ? `${recipe.category} tradicional navideño.` : 'Receta navideña tradicional.'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center text-[#e8e0e0] opacity-90 text-xs sm:text-sm">
                    <div className="flex items-center gap-1">
                      <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="9" stroke="#eadede" strokeWidth="1.6"/>
                        <path d="M12 7v5l3 2" stroke="#eadede" strokeWidth="1.6" strokeLinecap="round"/>
                      </svg>
                      <span>{formatTime(recipe.prep_time_minutes)}</span>
                    </div>
                    <div className="hidden sm:block w-1 h-1 bg-[#7b6e6e] rounded-full opacity-80"></div>
                    <span>{recipe.yield || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleBackToRecipes}
                className="h-10 sm:h-11 px-3 sm:px-4 bg-transparent border border-white/8 text-white rounded-full hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
              >
                Volver
              </button>
              {isOwner && !isEditing && (
                <button
                  onClick={handleStartEditing}
                  className="h-10 sm:h-11 inline-flex items-center justify-center gap-2 px-3 sm:px-4 rounded-full text-white bg-transparent border border-white/8 hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto"
                >
                  <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Editar</span>
                </button>
              )}
              {isOwner && isEditing && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleSaveChanges}
                    disabled={updateRecipeMutation.isPending}
                    className="h-10 sm:h-11 inline-flex items-center justify-center gap-2 px-3 sm:px-4 rounded-full text-white bg-green-600 border border-white/6 shadow-[0_10px_26px_rgba(34,197,94,0.35)] font-bold cursor-pointer hover:shadow-[0_12px_30px_rgba(34,197,94,0.45)] active:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto"
                  >
                    {updateRecipeMutation.isPending ? (
                      <>
                        <Spinner size="sm" color="white" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Guardar</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEditing}
                    disabled={updateRecipeMutation.isPending}
                    className="h-10 sm:h-11 px-3 sm:px-4 bg-transparent border border-white/8 text-white rounded-full hover:bg-white/5 transition-colors text-xs sm:text-sm font-medium disabled:opacity-50 w-full sm:w-auto"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              {!isEditing && (
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="h-10 sm:h-11 inline-flex items-center justify-center gap-2 px-3 sm:px-4 rounded-full text-white bg-[#e74a3b] border border-white/6 shadow-[0_10px_26px_rgba(231,74,59,0.35)] font-bold cursor-pointer hover:shadow-[0_12px_30px_rgba(231,74,59,0.45)] active:bg-[#c83e31] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm w-full sm:w-auto"
                >
                  {isGenerating ? (
                    <>
                      <Spinner size="sm" color="white" />
                      <span>Generando PDF...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 3v10m0 0l-3-3m3 3l3-3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <rect x="4" y="13" width="16" height="8" rx="2" stroke="#fff" strokeWidth="1.6"/>
                      </svg>
                      <span>Descargar PDF</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <div className="mt-3 bg-[#1c1010] p-2 rounded-[22px] border border-red-500/22 shadow-[0_28px_60px_rgba(0,0,0,0.6)]">
            {recipe.photo_url ? (
              <img
                src={recipe.photo_url}
                alt={`Foto de ${recipe.title}`}
                className="w-full rounded-[18px] h-auto object-cover"
              />
            ) : (
              <div className="w-full h-64 rounded-[18px] bg-gray-700 flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
          </div>

          {/* Divider */}
          <hr className="h-px border-none bg-gradient-to-r from-white/4 via-white/12 to-white/4 my-4" />

          {/* Steps Section */}
          <section className="mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 mb-2 mt-5">
              <h2 className="text-base sm:text-lg font-bold text-[#f4f2f2]">Preparación (pasos)</h2>
              {isEditing && editedData && (
                <button
                  onClick={handleAddStep}
                  className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-colors text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
                >
                  <svg width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Añadir paso
                </button>
              )}
            </div>
            {isEditing && editedData ? (
              <ol className="list-none p-0 m-1 sm:m-2 mt-0 flex flex-col gap-3 sm:gap-4">
                {editedData.steps.map((step, stepIndex) => (
                  <li
                    key={stepIndex}
                    className="bg-transparent rounded-xl p-2 sm:p-3 border border-white/20 hover:border-white/30 transition-all"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#291515] text-[#f0e0e0] font-extrabold border border-white/8 text-sm flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                          <textarea
                            value={step.instruction_md || ''}
                            onChange={(e) => {
                              const updatedSteps = [...editedData.steps];
                              updatedSteps[stepIndex] = {
                                ...updatedSteps[stepIndex],
                                instruction_md: e.target.value,
                              };
                              setEditedData({ ...editedData, steps: updatedSteps });
                            }}
                            className="w-full bg-[#1c1010] text-[#efe8e8] border border-white/20 rounded-lg px-3 py-2 focus:border-[#f7a940]/55 focus:ring-2 focus:ring-[#f7a940]/12 outline-none resize-y min-h-[80px]"
                            placeholder="Describe el paso..."
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={step.time_minutes || ''}
                              onChange={(e) => {
                                const updatedSteps = [...editedData.steps];
                                updatedSteps[stepIndex] = {
                                  ...updatedSteps[stepIndex],
                                  time_minutes: e.target.value ? parseInt(e.target.value) : undefined,
                                };
                                setEditedData({ ...editedData, steps: updatedSteps });
                              }}
                              placeholder="Tiempo (min)"
                              className="w-24 bg-[#1c1010] text-[#eadfdf] border border-white/20 rounded-lg px-2 py-1 text-xs focus:border-[#f7a940]/55 focus:ring-2 focus:ring-[#f7a940]/12 outline-none"
                            />
                            <input
                              type="text"
                              value={step.ingredients_json?.join(', ') || ''}
                              onChange={(e) => {
                                const ingredients = e.target.value
                                  .split(',')
                                  .map((i) => i.trim())
                                  .filter((i) => i.length > 0);
                                const updatedSteps = [...editedData.steps];
                                updatedSteps[stepIndex] = {
                                  ...updatedSteps[stepIndex],
                                  ingredients_json: ingredients,
                                };
                                setEditedData({ ...editedData, steps: updatedSteps });
                              }}
                              placeholder="Ingredientes (separados por coma)"
                              className="flex-1 bg-[#1c1010] text-[#f2d7d7] border border-white/20 rounded-lg px-2 py-1 text-xs focus:border-[#f7a940]/55 focus:ring-2 focus:ring-[#f7a940]/12 outline-none"
                            />
                            <button
                              onClick={() => handleRemoveStep(stepIndex)}
                              className="px-3 py-1 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg hover:bg-red-600/30 transition-colors text-xs font-medium"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            ) : recipe.steps && recipe.steps.length > 0 ? (
              <ol className="list-none p-0 m-1 sm:m-2 mt-0 flex flex-col gap-3 sm:gap-4">
                {recipe.steps.map((step) => (
                  <li
                    key={step.id}
                    className="bg-transparent rounded-xl p-2 sm:p-3 border border-transparent hover:border-white/6 hover:bg-white/2 transition-all"
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-3 items-start">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center bg-[#291515] text-[#f0e0e0] font-extrabold border border-white/8 text-xs sm:text-sm flex-shrink-0">
                        {step.step_number}
                      </div>
                      <div className="text-[#efe8e8] text-sm sm:text-base">{step.instruction_md}</div>
                      {step.time_minutes && (
                        <div className="justify-self-end px-2 py-1 text-xs text-[#eadfdf] bg-[#2a2727] border border-white/8 rounded-full whitespace-nowrap">
                          {step.time_minutes} min
                        </div>
                      )}
                      {step.ingredients_json && step.ingredients_json.length > 0 && (
                        <div className="col-start-2 col-end-3 flex flex-wrap gap-1.5 sm:gap-2 mt-1">
                          {step.ingredients_json.map((ingredient, ingredientIndex) => (
                            <span
                              key={ingredientIndex}
                              className="bg-[#2a1717] border border-white/8 text-[#f2d7d7] text-xs px-2 py-1 rounded-full"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[#cbbfbf] text-sm">No hay pasos disponibles para esta receta.</p>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
