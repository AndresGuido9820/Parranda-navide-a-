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
      console.log("Profile updated successfully:", updatedProfile);
      // Update the profile cache immediately
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
      
      // Also invalidate to force refetch fresh data
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      
      // Refetch to ensure we have the latest data
      queryClient.refetchQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
};

/**
 * Hook to upload avatar (only uploads, doesn't update profile)
 */
export const useUploadAvatar = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      // Upload the file and return the URL
      const avatarUrl = await uploadAvatar(file);
      return avatarUrl;
    },
  });
};

