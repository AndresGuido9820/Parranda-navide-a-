export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  APP_NAME: 'Parranda Navideña',
  VERSION: '1.0.0',
  
  // S3 Media Storage
  S3_BUCKET_URL: import.meta.env.VITE_S3_BUCKET_URL || 'https://parranda-navidena-media-1764647392.s3.amazonaws.com',
  S3_PATHS: {
    SONGS: 'songs',
    RECIPES: 'recipes',
    AVATARS: 'avatars',
  },
} as const;

// Helper functions for S3 URLs
export const getS3Url = (path: string): string => {
  return `${config.S3_BUCKET_URL}/${path}`;
};

export const getSongThumbnailUrl = (filename: string): string => {
  return `${config.S3_BUCKET_URL}/${config.S3_PATHS.SONGS}/${filename}`;
};

export const getRecipeImageUrl = (filename: string): string => {
  return `${config.S3_BUCKET_URL}/${config.S3_PATHS.RECIPES}/${filename}`;
};

export const getAvatarUrl = (filename: string): string => {
  return `${config.S3_BUCKET_URL}/${config.S3_PATHS.AVATARS}/${filename}`;
};
