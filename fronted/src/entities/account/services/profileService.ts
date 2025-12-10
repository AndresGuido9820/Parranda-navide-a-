/**
 * Profile API Service
 */

import api from '../../../shared/api/api';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  alias: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  alias?: string;
  phone?: string;
  avatar_url?: string;
}

export interface ProfileStats {
  favoriteRecipes: number;
  contributions: number;
  participationLevel: number;
  completedNovenas: number;
}

/**
 * Get current user profile
 */
export const getMyProfile = async (): Promise<UserProfile> => {
  const response = await api.get<{ data: UserProfile }>('/auth/me');
  return response.data.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
  const response = await api.patch<{ data: UserProfile }>('/auth/me', data);
  return response.data.data;
};

/**
 * Upload avatar image and update profile
 */
export const uploadAvatar = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<{ data: { url: string } }>('/api/v1/uploads/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data.url;
};

/**
 * Get user stats (recipes, contributions, etc.)
 */
export const getProfileStats = async (): Promise<ProfileStats> => {
  // TODO: Implement when backend endpoints are ready
  // For now, return mock data
  return {
    favoriteRecipes: 0,
    contributions: 0,
    participationLevel: 0,
    completedNovenas: 0,
  };
};

