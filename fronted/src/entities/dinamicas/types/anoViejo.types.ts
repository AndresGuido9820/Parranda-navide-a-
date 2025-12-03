export type DressPartType = 'sombrero' | 'camisa' | 'pantalones' | 'zapatos' | 'accesorios';

export interface DressOption {
  id: string;
  nombre: string;
  color: string;
  estilo: string;
  icono: string;
}

export type BurnStatus = 'sin-quemar' | 'quemando' | 'quemado';

export interface AnoViejoState {
  partes: Record<DressPartType, DressOption | null>;
  burnStatus: BurnStatus;
}

export interface UseAnoViejoReturn {
  state: AnoViejoState;
  dressPart: (part: DressPartType, option: DressOption) => void;
  burn: () => Promise<void>;
  reset: () => void;
  dressOptions: Record<DressPartType, DressOption[]>;
}











