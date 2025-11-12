import { useCallback, useState } from 'react';
import { generateRecipePDF } from '../../../shared/utils/pdfGenerator';
import type { RecipeResponse } from '../types/recipe.types';

/**
 * Hook para descargar una receta en formato PDF
 */
export const useDownloadRecipePDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadPDF = useCallback(async (recipe: RecipeResponse | null | undefined) => {
    if (!recipe) {
      console.error('No se puede generar el PDF: receta no disponible');
      return;
    }

    setIsGenerating(true);
    try {
      await generateRecipePDF(recipe);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { downloadPDF, isGenerating };
};

