export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  category: MeditationCategory;
  audioUrl?: string;
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: Date;
}

export interface MeditationCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface UserProgress {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  completedSessions: string[]; // session IDs
  favoriteCategories: string[]; // category IDs
}

export interface MeditationPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  session: MeditationSession | null;
}
