import { Spinner } from '@heroui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../../shared/layouts/MainLayout';
import { useCreateRecipe } from '../../../services';
import type { RecipeStep } from './components';
import { ImageDropzone, RecipeStepItem, TagInput } from './components';

export const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const createRecipeMutation = useCreateRecipe();
  const [recipeName, setRecipeName] = useState('');
  const [alias, setAlias] = useState('');
  const [category, setCategory] = useState<string>('');
  const [yieldText, setYieldText] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<RecipeStep[]>([
    {
      id: '1',
      stepNumber: 1,
      time: 5,
      description: 'Mezcla harina, polvo para hornear, sal y azúcar.',
      ingredients: ['harina', 'polvo para hornear', 'sal', 'azúcar']
    }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const addStep = () => {
    const newStep: RecipeStep = {
      id: Date.now().toString(),
      stepNumber: steps.length + 1,
      time: 5,
      description: '',
      ingredients: []
    };
    setSteps([...steps, newStep]);
  };

  const updateStep = (updatedStep: RecipeStep) => {
    setSteps(steps.map(step => 
      step.id === updatedStep.id ? updatedStep : step
    ));
  };

  const removeStep = (stepId: string) => {
    const newSteps = steps.filter(step => step.id !== stepId);
    // Renumber steps
    const renumberedSteps = newSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));
    setSteps(renumberedSteps);
  };

  const getTotalTime = () => {
    return steps.reduce((total, step) => total + step.time, 0);
  };

  const handleSubmit = async () => {
    // Validaciones básicas
    if (!recipeName.trim()) {
      alert('Por favor ingresa el nombre de la receta');
      return;
    }
    if (!alias.trim()) {
      alert('Por favor ingresa tu alias');
      return;
    }
    if (steps.length === 0 || steps.some(step => !step.description.trim())) {
      alert('Por favor completa todos los pasos');
      return;
    }

    try {
      const photoFile = uploadedFiles.length > 0 ? uploadedFiles[0] : undefined;
      
      await createRecipeMutation.mutateAsync({
        title: recipeName.trim(),
        author_alias: alias.trim(),
        prep_time_minutes: getTotalTime(),
        yield: yieldText.trim() || undefined,
        category: category || undefined,
        tags: ingredients.length > 0 ? ingredients.map(ing => `#${ing}`) : undefined,
        steps: steps.map(step => ({
          instruction_md: step.description.trim(),
          ingredients_json: step.ingredients,
          time_minutes: step.time,
        })),
        photo_file: photoFile,
      });

      // Navegar a la página de recetas después de crear
      navigate('/recetas');
    } catch (error) {
      console.error('Error al crear la receta:', error);
      alert('Error al crear la receta. Por favor intenta nuevamente.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-[1120px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-14 pb-12 sm:pb-16 md:pb-20">
        {/* Breadcrumbs */}
        <div className="text-[#b9acac] text-xs sm:text-sm tracking-wide opacity-90 mb-2">
          Recetas / <strong className="text-[#f0f0f0]">Buñuelos de Navidad</strong>
        </div>

        {/* Header */}
        <h1 className="text-xl sm:text-2xl md:text-[30px] font-bold text-[#f0f0f0] mb-1">
          ¡Comparte tu propia receta!
        </h1>
        <p className="text-[#b9acac] text-sm sm:text-base mb-3 sm:mb-4">
          ¿Tienes una versión especial de esta receta o una nueva para compartir? ¡Nos encantaría verla!
        </p>

        {/* Main Panel */}
        <div className="bg-black/30 backdrop-blur-sm border border-red-500/30 rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-4 sm:p-5 md:p-6">
          {/* Top Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-5 md:gap-6 mb-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Recipe Name */}
              <div className="space-y-2">
                <label className="text-xs text-[#b9acac] font-medium">Nombre de la receta</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  placeholder="Ej: Buñuelos de la abuela"
                  className="w-full bg-black/40 text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                />
              </div>

              {/* Alias */}
              <div className="space-y-2">
                <label className="text-xs text-[#b9acac] font-medium">Tu alias</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Tu nombre para mostrar"
                  className="w-full bg-black/40 text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs text-[#b9acac] font-medium">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="postres">Postres</option>
                  <option value="platos">Platos principales</option>
                </select>
              </div>

              {/* Yield */}
              <div className="space-y-2">
                <label className="text-xs text-[#b9acac] font-medium">Rinde (opcional)</label>
                <input
                  type="text"
                  value={yieldText}
                  onChange={(e) => setYieldText(e.target.value)}
                  placeholder="Ej: 8 porciones, 6 vasos"
                  className="w-full bg-black/40 text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                />
              </div>

              {/* Ingredients */}
              <TagInput
                tags={ingredients}
                onTagsChange={setIngredients}
                label="Ingrediente principal"
                placeholder="Escribe ingrediente y presiona Enter"
                hint="Escribe ingrediente y presiona Enter"
              />
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs text-[#b9acac] font-medium">Sube tu foto</label>
                <ImageDropzone
                  onFilesSelected={setUploadedFiles}
                  maxFiles={3}
                  maxSize={10}
                />
              </div>
            </div>
          </div>

          {/* Steps Section */}
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-4 sm:gap-5 md:gap-6 mt-4">
            <div></div>
            <div className="space-y-3 sm:space-y-4">
              <label className="text-xs text-[#b9acac] font-medium">Pasos (con tiempo e ingredientes por paso)</label>
              <div className="space-y-2 sm:space-y-3">
                {steps.map((step) => (
                  <RecipeStepItem
                    key={step.id}
                    step={step}
                    onUpdate={updateStep}
                    onRemove={removeStep}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={addStep}
              className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-[#241616] border border-white/8 text-white rounded-xl hover:bg-[#2a1919] transition-colors text-sm w-full sm:w-auto"
            >
              <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="#e7d6d6" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>Añadir paso</span>
            </button>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <span className="text-[#b9acac] text-xs sm:text-sm text-center sm:text-left">
                Tiempo total: {getTotalTime()} min
              </span>
              <button
                onClick={handleSubmit}
                disabled={createRecipeMutation.isPending}
                className="inline-flex items-center justify-center gap-2 h-10 sm:h-12 px-4 sm:px-5 rounded-full bg-[#e74a3b] border border-white/6 text-white font-bold shadow-[0_12px_26px_rgba(231,74,59,0.35)] hover:shadow-[0_14px_30px_rgba(231,74,59,0.45)] active:bg-[#c83e31] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base w-full sm:w-auto"
              >
                {createRecipeMutation.isPending ? (
                  <>
                    <Spinner size="sm" color="white" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 5l10 7-10 7V5z" fill="white"/>
                    </svg>
                    <span>Enviar Receta</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
