import { jsPDF } from 'jspdf';
import type { RecipeResponse } from '../../entities/recetas/types/recipe.types';

/**
 * Convierte una URL de imagen a base64
 * Maneja diferentes formatos de imagen (JPEG, PNG, etc.)
 */
const imageToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
      credentials: 'omit',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error al cargar la imagen:', error);
    throw error;
  }
};

/**
 * Detecta el formato de imagen desde el base64
 */
const getImageFormat = (base64: string): 'JPEG' | 'PNG' => {
  if (base64.startsWith('data:image/png')) {
    return 'PNG';
  }
  return 'JPEG';
};

/**
 * Formatea el tiempo en minutos a un formato legible
 */
const formatTime = (minutes: number | null): string => {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Genera y descarga un PDF de la receta con diseño profesional y estilizado
 */
export const generateRecipePDF = async (recipe: RecipeResponse): Promise<void> => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Configurar para mejor soporte de caracteres especiales
    // jsPDF maneja UTF-8 por defecto, pero algunos caracteres pueden necesitar encoding específico

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Paleta de colores navideña profesional
    const colors = {
      primary: [231, 74, 59],      // Rojo navideño principal
      dark: [22, 10, 10],          // Fondo oscuro
      light: [244, 242, 242],      // Texto claro
      accent: [203, 62, 49],       // Rojo oscuro
      gold: [255, 193, 7],         // Dorado para estrellas
      gray: [245, 245, 245],       // Gris claro para fondos
      grayBorder: [230, 230, 230], // Borde gris
      textDark: [60, 60, 60],     // Texto oscuro
      textLight: [150, 150, 150],  // Texto secundario
    };

    // Función para agregar nueva página si es necesario
    const checkPageBreak = (requiredHeight: number): void => {
      if (yPosition + requiredHeight > pageHeight - margin - 20) {
        doc.addPage();
        yPosition = margin;
      }
    };

    // ==================== HEADER ELEGANTE ====================
    // Fondo degradado simulado (capas de color)
    doc.setFillColor(colors.dark[0], colors.dark[1], colors.dark[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    // Barra decorativa superior
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 3, 'F');
    
    yPosition = 18;

    // Título principal con sombra simulada
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
    
    const titleLines = doc.splitTextToSize(recipe.title.toUpperCase(), contentWidth - 10);
    titleLines.forEach((line: string, index: number) => {
      // Sombra de texto
      doc.setTextColor(colors.dark[0], colors.dark[1], colors.dark[2]);
      doc.text(line, pageWidth / 2 + 0.5, yPosition + index * 9 + 0.5, { align: 'center' });
      // Texto principal
      doc.setTextColor(colors.light[0], colors.light[1], colors.light[2]);
      doc.text(line, pageWidth / 2, yPosition + index * 9, { align: 'center' });
    });
    
    yPosition = 55;

    // ==================== IMAGEN PRINCIPAL ====================
    if (recipe.photo_url) {
      try {
        checkPageBreak(75);
        
        const imageBase64 = await imageToBase64(recipe.photo_url);
        const imageFormat = getImageFormat(imageBase64);
        
        // Calcular dimensiones manteniendo proporción
        const maxImgWidth = contentWidth - 4;
        const maxImgHeight = 65;
        let imgWidth = maxImgWidth;
        let imgHeight = maxImgHeight;
        
        // Intentar obtener dimensiones reales de la imagen
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            const aspectRatio = img.width / img.height;
            if (aspectRatio > maxImgWidth / maxImgHeight) {
              imgWidth = maxImgWidth;
              imgHeight = maxImgWidth / aspectRatio;
            } else {
              imgHeight = maxImgHeight;
              imgWidth = maxImgHeight * aspectRatio;
            }
            resolve();
          };
          img.onerror = reject;
          img.src = imageBase64;
        });
        
        const imgX = (pageWidth - imgWidth) / 2;
        
        // Sombra decorativa
        doc.setFillColor(200, 200, 200);
        doc.rect(imgX + 1, yPosition + 1, imgWidth, imgHeight, 'F');
        
        // Marco elegante con doble borde
        doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setLineWidth(3);
        doc.rect(imgX - 2, yPosition - 2, imgWidth + 4, imgHeight + 4);
        
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.rect(imgX - 1, yPosition - 1, imgWidth + 2, imgHeight + 2);
        
        // Agregar imagen
        doc.addImage(
          imageBase64,
          imageFormat,
          imgX,
          yPosition,
          imgWidth,
          imgHeight,
          undefined,
          'MEDIUM'
        );
        
        yPosition += imgHeight + 18;
      } catch (error) {
        console.warn('No se pudo cargar la imagen, continuando sin ella:', error);
        // Continuar sin imagen
      }
    }

    // Fondo blanco para contenido
    doc.setFillColor(255, 255, 255);
    doc.rect(margin, yPosition - 10, contentWidth, pageHeight - yPosition - 15, 'F');
    
    yPosition += 5;

    // ==================== TARJETA DE INFORMACIÓN ====================
    const infoBoxY = yPosition;
    const infoBoxHeight = 28;

    // Fondo elegante con gradiente simulado
    doc.setFillColor(colors.gray[0], colors.gray[1], colors.gray[2]);
    doc.setDrawColor(colors.grayBorder[0], colors.grayBorder[1], colors.grayBorder[2]);
    doc.setLineWidth(0.8);
    doc.rect(margin, infoBoxY, contentWidth, infoBoxHeight, 'FD');

    // Línea decorativa superior en color primario
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(margin, infoBoxY, contentWidth, 2, 'F');

    let infoX = margin + 10;
    let infoY = infoBoxY + 9;
    let currentX = infoX;

    // Autor con estilo
    if (recipe.author_alias) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text('Por', currentX, infoY);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
      doc.text(recipe.author_alias, currentX + 10, infoY);
      currentX += 45;
    }

    // Separador vertical elegante
    if (recipe.author_alias && recipe.category) {
      doc.setDrawColor(colors.grayBorder[0], colors.grayBorder[1], colors.grayBorder[2]);
      doc.setLineWidth(0.5);
      doc.line(currentX - 3, infoY - 4, currentX - 3, infoY + 6);
      currentX += 8;
    }

    // Categoría destacada
    if (recipe.category) {
      doc.setFontSize(9);
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.setFont('helvetica', 'normal');
      doc.text('Categoría', currentX, infoY);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      const categoryText = recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1);
      doc.text(categoryText, currentX + 20, infoY);
      currentX += 65;
    }

    // Nueva línea para métricas
    infoY += 11;
    currentX = infoX;

    // Iconos y métricas estilizadas
    doc.setFontSize(9);

    // Tiempo
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text('Tiempo:', currentX, infoY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
    doc.text(formatTime(recipe.prep_time_minutes), currentX + 18, infoY);
    currentX += 45;

    // Rendimiento
    if (recipe.yield) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text('Rinde:', currentX, infoY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
      doc.text(recipe.yield, currentX + 15, infoY);
      currentX += 40;
    }

    // Rating con estrella ASCII
    if (recipe.rating) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(colors.gold[0], colors.gold[1], colors.gold[2]);
      doc.text('*', currentX, infoY);
      doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
      doc.text(recipe.rating.toFixed(1), currentX + 4, infoY);
    }

    yPosition = infoBoxY + infoBoxHeight + 12;

    // ==================== TAGS ELEGANTES ====================
    if (recipe.tags && recipe.tags.length > 0) {
      let tagX = margin + 10;
      
      recipe.tags.forEach((tag) => {
        const tagText = tag.startsWith('#') ? tag : `#${tag}`;
        doc.setFontSize(7.5);
        const tagWidth = doc.getTextWidth(tagText) + 8;
        
        if (tagX + tagWidth > pageWidth - margin - 5) {
          tagX = margin + 10;
          yPosition += 7;
        }
        
        // Fondo degradado simulado (capas)
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(tagX - 0.5, yPosition - 3.5, tagWidth + 1, 6.5, 'F');
        
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(tagX, yPosition - 3, tagWidth, 6, 'F');
        
        // Borde sutil
        doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.setLineWidth(0.3);
        doc.rect(tagX, yPosition - 3, tagWidth, 6);
        
        // Texto blanco
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(tagText, tagX + 4, yPosition + 0.5);
        
        tagX += tagWidth + 5;
      });
      
      yPosition += 12;
    }

    // ==================== SEPARADOR DECORATIVO ====================
    yPosition += 5;
    
    // Línea principal
    doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.setLineWidth(2);
    doc.line(margin + 15, yPosition, pageWidth - margin - 15, yPosition);
    
    // Decoración central
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.circle(pageWidth / 2, yPosition, 3, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(pageWidth / 2, yPosition, 1.5, 'F');
    
    yPosition += 18;

    // ==================== SECCIÓN PREPARACIÓN ====================
    // Encabezado con fondo de color
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(margin, yPosition - 7, contentWidth, 12, 'F');
    
    // Borde inferior decorativo
    doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    doc.rect(margin, yPosition + 4, contentWidth, 1.5, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('PREPARACIÓN', pageWidth / 2, yPosition + 2, { align: 'center' });
    
    yPosition += 20;

    // ==================== PASOS DE PREPARACIÓN ====================
    if (recipe.steps && recipe.steps.length > 0) {
      recipe.steps.forEach((step) => {
        checkPageBreak(38);
        
        const stepBoxY = yPosition;
        const stepBoxHeight = 32;
        
        // Fondo con sombra sutil
        doc.setFillColor(248, 248, 248);
        doc.rect(margin + 0.5, stepBoxY + 0.5, contentWidth - 1, stepBoxHeight - 1, 'F');
        
        // Borde principal
        doc.setFillColor(colors.gray[0], colors.gray[1], colors.gray[2]);
        doc.setDrawColor(colors.grayBorder[0], colors.grayBorder[1], colors.grayBorder[2]);
        doc.setLineWidth(0.8);
        doc.rect(margin, stepBoxY, contentWidth, stepBoxHeight, 'FD');
        
        // Línea lateral de color
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(margin, stepBoxY, 3, stepBoxHeight, 'F');
        
        // Círculo numerado elegante
        const circleX = margin + 16;
        const circleY = stepBoxY + 9;
        
        // Sombra del círculo
        doc.setFillColor(200, 200, 200);
        doc.circle(circleX + 0.5, circleY + 0.5, 7.5, 'F');
        
        // Círculo principal
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.circle(circleX, circleY, 7, 'F');
        
        // Borde blanco del círculo
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.circle(circleX, circleY, 7);
        
        // Número en el círculo
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(step.step_number.toString(), circleX, circleY + 1.5, { align: 'center' });
        
        // Instrucción
        doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const instructionX = margin + 28;
        const instructionWidth = contentWidth - 38;
        const instructionLines = doc.splitTextToSize(step.instruction_md, instructionWidth);
        
        instructionLines.forEach((line: string, lineIndex: number) => {
          doc.text(line, instructionX, stepBoxY + 8 + lineIndex * 5.5);
        });
        
        let detailY = stepBoxY + 8 + instructionLines.length * 5.5 + 4;
        
        // Información adicional del paso
        const detailsX = instructionX;
        
        // Tiempo del paso
        if (step.time_minutes) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'italic');
          doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
          doc.text(`Tiempo: ${step.time_minutes} min`, detailsX, detailY);
          detailY += 5;
        }
        
        // Ingredientes del paso con estilo
        if (step.ingredients_json && step.ingredients_json.length > 0) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
          doc.text('Ingredientes:', detailsX, detailY);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
          // Handle both string and object formats
          const ingredientsText = step.ingredients_json
            .map((ing: any) => typeof ing === 'string' 
              ? ing 
              : (ing?.name || ing?.amount || JSON.stringify(ing)))
            .join(' • ');
          const ingredientsLines = doc.splitTextToSize(ingredientsText, instructionWidth - 25);
          ingredientsLines.forEach((line: string, lineIndex: number) => {
            doc.text(line, detailsX + 22, detailY + lineIndex * 4);
          });
          detailY += Math.max(ingredientsLines.length * 4, 4) + 2;
        }
        
        yPosition += stepBoxHeight + 10;
      });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.text('No hay pasos disponibles para esta receta.', margin + 10, yPosition);
      yPosition += 10;
    }

    // ==================== PIE DE PÁGINA ELEGANTE ====================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Línea decorativa superior del pie
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(1);
      doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
      
      // Fondo del pie de página
      doc.setFillColor(colors.gray[0], colors.gray[1], colors.gray[2]);
      doc.rect(margin, pageHeight - 17, contentWidth, 17, 'F');
      
      // Texto del pie
      doc.setFontSize(8);
      doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
      doc.setFont('helvetica', 'italic');
      
      const footerText = `Página ${i} de ${totalPages} - Generado desde Parranda Navideña`;
      doc.text(footerText, pageWidth / 2, pageHeight - 9, { align: 'center' });
      
      // Decoración en el pie
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.circle(pageWidth / 2, pageHeight - 9, 1, 'F');
    }

    // ==================== DESCARGAR PDF ====================
    const fileName = `${recipe.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    throw error;
  }
};

