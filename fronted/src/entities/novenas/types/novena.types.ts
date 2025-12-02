/**
 * Novena types for API responses.
 */

export interface NovenaSection {
  id: string;
  section_type: 'ORACION' | 'GOZO' | 'VILLANCICO';
  position: number;
  content_md: string;
}

export interface NovenaDay {
  id: string;
  day_number: number;
  title: string;
  sections: NovenaSection[];
  created_at: string;
}

export interface NovenaDayListResponse {
  days: NovenaDay[];
  total: number;
}

export interface UserProgress {
  day_id: string;
  day_number: number;
  day_title: string;
  is_completed: boolean;
  completed_at: string | null;
  last_read_at: string | null;
}

export interface UserProgressListResponse {
  progress: UserProgress[];
  completed_count: number;
  total_days: number;
}

export interface MarkDayCompleteRequest {
  day_number: number;
}

