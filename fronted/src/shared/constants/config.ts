export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  APP_NAME: 'Parranda Navideña',
  VERSION: '1.0.0',
} as const;
