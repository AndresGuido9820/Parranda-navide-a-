import { useState, useCallback } from 'react';
import type {
  AnoViejoState,
  BurnStatus,
  DressPartType,
  DressOption,
  UseAnoViejoReturn,
} from '../types/anoViejo.types';

const DRESS_OPTIONS: Record<DressPartType, DressOption[]> = {
  sombrero: [
    { id: 'navideno', nombre: 'Gorro Navideño', color: '#A62120', estilo: 'festivo', icono: '' },
    { id: 'vueltiao', nombre: 'Sombrero Mexicano', color: '#8B4513', estilo: 'tradicional', icono: '' },
    { id: 'sombrero-svg', nombre: 'Sombrero Clásico', color: '#2E2E2E', estilo: 'clásico', icono: '' },
    { id: 'one-piece', nombre: 'Sombrero de Paja', color: '#FFD020', estilo: 'aventura', icono: '' },
    { id: 'elf-hat', nombre: 'Gorro de Elfo', color: '#bf0603', estilo: 'navideño', icono: '' },
    { id: 'ninguno', nombre: 'Sin sombrero', color: 'transparent', estilo: 'ninguno', icono: '' },
  ],
  camisa: [
    { id: 'blanca', nombre: 'Camisa Blanca', color: '#FFFFFF', estilo: 'formal', icono: '' },
    { id: 'roja', nombre: 'Camisa Roja', color: '#DC2626', estilo: 'festivo', icono: '' },
    { id: 'azul', nombre: 'Camisa Azul', color: '#2563EB', estilo: 'casual', icono: '' },
    { id: 'verde', nombre: 'Camisa Verde', color: '#16A34A', estilo: 'casual', icono: '' },
  ],
  pantalones: [
    { id: 'negro', nombre: 'Pantalón Negro', color: '#000000', estilo: 'formal', icono: '' },
    { id: 'azul', nombre: 'Pantalón Azul', color: '#1E40AF', estilo: 'casual', icono: '' },
    { id: 'gris', nombre: 'Pantalón Gris', color: '#6B7280', estilo: 'casual', icono: '' },
    { id: 'beige', nombre: 'Pantalón Beige', color: '#D4A574', estilo: 'casual', icono: '' },
  ],
  zapatos: [
    { id: 'negros', nombre: 'Zapatos Negros', color: '#000000', estilo: 'formal', icono: '' },
    { id: 'rojos', nombre: 'Zapatos Rojos', color: '#EF4444', estilo: 'deportivo', icono: '' },
    { id: 'azules', nombre: 'Zapatos Azules', color: '#2563EB', estilo: 'casual', icono: '' },
    { id: 'marrones', nombre: 'Zapatos Marrones', color: '#78350F', estilo: 'casual', icono: '' },
    { id: 'cafe', nombre: 'Zapatos Café', color: '#92400E', estilo: 'casual', icono: '' },
  ],
  accesorios: [
    { id: 'gafas', nombre: 'Gafas', color: '#1F2937', estilo: 'accesorio', icono: '' },
    { id: 'gafas-negras', nombre: 'Gafas Negras', color: '#000000', estilo: 'accesorio', icono: '' },
    { id: 'barba', nombre: 'Barba', color: '#773300', estilo: 'accesorio', icono: '' },
    { id: 'reloj', nombre: 'Reloj', color: '#F59E0B', estilo: 'accesorio', icono: '' },
    { id: 'ninguno', nombre: 'Sin accesorios', color: 'transparent', estilo: 'ninguno', icono: '' },
  ],
};

const INITIAL_STATE: AnoViejoState = {
  partes: {
    sombrero: null,
    camisa: null,
    pantalones: null,
    zapatos: null,
    accesorios: null,
  },
  burnStatus: 'sin-quemar',
};

export const useAnoViejo = (): UseAnoViejoReturn => {
  const [state, setState] = useState<AnoViejoState>(INITIAL_STATE);

  const dressPart = useCallback((part: DressPartType, option: DressOption): void => {
    setState((prev) => {
      if (prev.burnStatus !== 'sin-quemar') {
        return prev;
      }

      const newPartes = { ...prev.partes };
      
      if (option.id === 'ninguno') {
        newPartes[part] = null;
      } else {
        newPartes[part] = option;
      }

      return {
        ...prev,
        partes: newPartes,
      };
    });
  }, []);

  const burn = useCallback(async (): Promise<void> => {
    return new Promise<void>((resolve) => {
      setState((prev) => ({
        ...prev,
        burnStatus: 'quemando',
      }));

      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          burnStatus: 'quemado',
        }));
        resolve();
      }, 3000);
    });
  }, []);

  const reset = useCallback((): void => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    dressPart,
    burn,
    reset,
    dressOptions: DRESS_OPTIONS,
  };
};

