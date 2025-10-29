import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../../shared/layouts/MainLayout';
import { ImageDropzone, RecipeStep, RecipeStepItem, TagInput } from './components';

export const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const [recipeName, setRecipeName] = useState('');
  const [alias, setAlias] = useState('');
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

  const handleSubmit = () => {
    const payload = {
      name: recipeName.trim(),
      alias: alias.trim(),
      ingredients,
      steps: steps.map(step => ({
        stepNumber: step.stepNumber,
        time: step.time,
        description: step.description,
        ingredients: step.ingredients
      })),
      total_time_min: getTotalTime(),
      images: uploadedFiles
    };
    
    console.log('Recipe payload:', payload);
    // Aquí iría la lógica para enviar la receta
    alert('Receta preparada para enviar (ver consola).');
  };

  return (
    <MainLayout>
      <div className="max-w-[1120px] mx-auto px-4 py-14 pb-20">
        {/* Breadcrumbs */}
        <div className="text-[#b9acac] text-sm tracking-wide opacity-90 mb-2">
          Recetas / <strong className="text-[#f0f0f0]">Buñuelos de Navidad</strong>
        </div>

        {/* Header */}
        <h1 className="text-[30px] font-bold text-[#f0f0f0] mb-1">
          ¡Comparte tu propia receta!
        </h1>
        <p className="text-[#b9acac] mb-4">
          ¿Tienes una versión especial de esta receta o una nueva para compartir? ¡Nos encantaría verla!
        </p>

        {/* Main Panel */}
        <div className="bg-[#171111] border border-red-500/22 rounded-[18px] shadow-[0_24px_60px_rgba(0,0,0,0.65)] p-6">
          {/* Top Grid */}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 mb-4">
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
                  className="w-full bg-[#0f0b0b] text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-[#f7a940]/55 focus:ring-3 focus:ring-[#f7a940]/12 outline-none transition-all"
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
                  className="w-full bg-[#0f0b0b] text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 focus:border-[#f7a940]/55 focus:ring-3 focus:ring-[#f7a940]/12 outline-none transition-all"
                />
              </div>

              {/* Ingredients */}
              <TagInput
                tags={ingredients}
                onTagsChange={setIngredients}
                label="Ingredientes (como tags)"
                placeholder="Escribe y presiona Enter"
                hint="Escribe un ingrediente y presiona Enter. Clic en × para quitar."
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
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 mt-4">
            <div></div>
            <div className="space-y-4">
              <label className="text-xs text-[#b9acac] font-medium">Pasos (con tiempo e ingredientes por paso)</label>
              <div className="space-y-3">
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
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={addStep}
              className="inline-flex items-center gap-2 px-3 py-2 bg-[#241616] border border-white/8 text-white rounded-xl hover:bg-[#2a1919] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="#e7d6d6" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span>Añadir paso</span>
            </button>

            <div className="flex items-center gap-4">
              <span className="text-[#b9acac] text-sm">
                Tiempo total: {getTotalTime()} min
              </span>
              <button
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-[#e74a3b] border border-white/6 text-white font-bold shadow-[0_12px_26px_rgba(231,74,59,0.35)] hover:shadow-[0_14px_30px_rgba(231,74,59,0.45)] active:bg-[#c83e31] transition-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 5l10 7-10 7V5z" fill="white"/>
                </svg>
                <span>Enviar Receta</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
