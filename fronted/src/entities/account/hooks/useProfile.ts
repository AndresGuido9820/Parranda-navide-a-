/**
 * Profile hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  type UpdateProfileRequest
} from '../services/profileService';

const PROFILE_QUERY_KEY = ['profile', 'me'];

/**
 * Hook to get current user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getMyProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Update the profile cache
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
      
      // Also invalidate to refetch fresh data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

/**
 * Hook to upload avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const updateProfileMutation = useUpdateProfile();

  return useMutation({
    mutationFn: async (file: File) => {
      // Upload the file
      const avatarUrl = await uploadAvatar(file);
      
      // Update profile with new avatar URL
      await updateProfileMutation.mutateAsync({ avatar_url: avatarUrl });
      
      return avatarUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

