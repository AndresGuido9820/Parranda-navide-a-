import React from 'react';

export interface RecipeStep {
  id: string;
  stepNumber: number;
  time: number;
  description: string;
  ingredients: string[];
}

interface RecipeStepItemProps {
  step: RecipeStep;
  onUpdate: (step: RecipeStep) => void;
  onRemove: (stepId: string) => void;
}

export const RecipeStepItem: React.FC<RecipeStepItemProps> = ({
  step,
  onUpdate,
  onRemove,
}) => {
  const handleTimeChange = (time: number) => {
    onUpdate({ ...step, time });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ ...step, description });
  };

  const handleIngredientsChange = (ingredients: string[]) => {
    onUpdate({ ...step, ingredients });
  };

  return (
    <div className="bg-[#120d0d] border border-white/8 rounded-xl p-3">
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center mb-2 text-[#ddd]">
        <div className="font-bold">Paso {step.stepNumber}</div>
        <div className="text-right text-[#b9acac] text-sm">Tiempo (min)</div>
        <input
          type="number"
          min="0"
          step="1"
          value={step.time}
          onChange={(e) => handleTimeChange(Number(e.target.value))}
          className="w-20 text-center bg-[#0f0b0b] text-[#f0f0f0] border border-white/8 rounded-xl px-2 py-2 focus:border-[#f7a940]/55 focus:ring-3 focus:ring-[#f7a940]/12 outline-none transition-all"
        />
        <button
          onClick={() => onRemove(step.id)}
          className="px-2 py-1 bg-[#1b1414] border border-white/8 text-[#e4d7d7] rounded-lg hover:bg-[#201616] transition-colors text-sm"
        >
          Eliminar
        </button>
      </div>

      <textarea
        value={step.description}
        onChange={(e) => handleDescriptionChange(e.target.value)}
        placeholder="Describe el paso..."
        className="w-full min-h-[110px] bg-[#0f0b0b] text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-3 resize-y focus:border-[#f7a940]/55 focus:ring-3 focus:ring-[#f7a940]/12 outline-none transition-all"
      />

      <div className="mt-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-[#b9acac]">Ingredientes usados</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {step.ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-2 py-1 bg-[#2a1c1c] border border-white/8 rounded-full text-[#e7dcdc] text-xs"
            >
              {ingredient}
              <button
                onClick={() => {
                  const newIngredients = step.ingredients.filter((_, i) => i !== index);
                  handleIngredientsChange(newIngredients);
                }}
                className="text-[#d8bcbc] hover:text-white transition-colors"
                aria-label="Quitar"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          placeholder="Escribe ingrediente y presiona Enter"
          className="w-full mt-2 bg-[#0f0b0b] text-[#f0f0f0] border border-white/8 rounded-xl px-3 py-2 focus:border-[#f7a940]/55 focus:ring-3 focus:ring-[#f7a940]/12 outline-none transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const value = (e.target as HTMLInputElement).value.trim();
              if (value && !step.ingredients.includes(value)) {
                handleIngredientsChange([...step.ingredients, value]);
                (e.target as HTMLInputElement).value = '';
              }
            }
          }}
        />
      </div>
    </div>
  );
};
