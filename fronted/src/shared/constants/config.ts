export const config = {
  // API Configuration - must be set via VITE_API_URL environment variable
  API_URL: import.meta.env.VITE_API_URL || '',
  
  APP_NAME: 'Parranda Navideña',
  VERSION: '1.0.0',
} as const;

// Validate required environment variables
if (!config.API_URL) {
  throw new Error('VITE_API_URL is required. Please set it in your environment variables.');
}

// Note: All image URLs (avatars, recipe photos, song thumbnails) come from the backend API
// The backend returns complete S3 URLs in the response (avatar_url, photo_url, thumbnail_url)
// No need to construct S3 URLs manually in the frontend
