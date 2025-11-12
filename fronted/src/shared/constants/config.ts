export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  YOUTUBE_API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || '',
  APP_NAME: 'Parranda Navideña',
  VERSION: '1.0.0',
} as const;
