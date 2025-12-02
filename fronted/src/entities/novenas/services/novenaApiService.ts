/**
 * Novena API Service.
 */

import { config } from '../../../shared/constants/config';
import type {
  NovenaDay,
  NovenaDayListResponse,
  UserProgress,
  UserProgressListResponse,
} from '../types/novena.types';

const API_URL = `${config.API_URL}/api/v1/novenas`;

/**
 * Get auth headers from localStorage.
 */
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all novena days.
 */
export const fetchNovenaDays = async (
  includeSections = false
): Promise<NovenaDayListResponse> => {
  const response = await fetch(
    `${API_URL}?include_sections=${includeSections}`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('Error fetching novena days');
  }

  const data = await response.json();
  return data.data as NovenaDayListResponse;
};

/**
 * Fetch a single novena day by number.
 */
export const fetchNovenaDayByNumber = async (
  dayNumber: number
): Promise<NovenaDay> => {
  const response = await fetch(`${API_URL}/day/${dayNumber}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error fetching day ${dayNumber}`);
  }

  const data = await response.json();
  return data.data as NovenaDay;
};

/**
 * Fetch user's novena progress.
 */
export const fetchUserProgress =
  async (): Promise<UserProgressListResponse> => {
    const response = await fetch(`${API_URL}/progress/me`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error fetching progress');
    }

    const data = await response.json();
    return data.data as UserProgressListResponse;
  };

/**
 * Mark a day as complete.
 */
export const markDayComplete = async (
  dayNumber: number
): Promise<UserProgress> => {
  const response = await fetch(`${API_URL}/progress/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ day_number: dayNumber }),
  });

  if (!response.ok) {
    throw new Error(`Error marking day ${dayNumber} as complete`);
  }

  const data = await response.json();
  return data.data as UserProgress;
};

/**
 * Update last read timestamp for a day.
 */
export const updateLastRead = async (
  dayNumber: number
): Promise<UserProgress> => {
  const response = await fetch(`${API_URL}/progress/read/${dayNumber}`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Error updating last read for day ${dayNumber}`);
  }

  const data = await response.json();
  return data.data as UserProgress;
};

/**
 * Reset all user progress.
 */
export const resetProgress = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/progress/reset`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Error resetting progress');
  }
};

