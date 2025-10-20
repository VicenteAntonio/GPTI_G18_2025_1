import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

interface UserProgress {
  userId: string;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  completedSessions: string[];
  favoriteCategories: string[];
}

export class StorageService {
  static async getUserProgress(): Promise<UserProgress> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
      return this.getDefaultProgress();
    } catch (error) {
      console.error('Error getting user progress:', error);
      return this.getDefaultProgress();
    }
  }

  static async saveUserProgress(progress: UserProgress): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving user progress:', error);
    }
  }

  static async getCompletedSessions(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting completed sessions:', error);
      return [];
    }
  }

  static async markSessionAsCompleted(sessionId: string): Promise<void> {
    try {
      const completedSessions = await this.getCompletedSessions();
      if (!completedSessions.includes(sessionId)) {
        completedSessions.push(sessionId);
        await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, JSON.stringify(completedSessions));

        // Update user progress
        const progress = await this.getUserProgress();
        progress.totalSessions += 1;
        progress.completedSessions.push(sessionId);

        // Update streak (simplified logic)
        const today = new Date().toDateString();
        const lastSessionDate = progress.completedSessions.length > 1 ?
          new Date().toDateString() : today;

        if (lastSessionDate === today) {
          progress.currentStreak += 1;
          if (progress.currentStreak > progress.longestStreak) {
            progress.longestStreak = progress.currentStreak;
          }
        }

        await this.saveUserProgress(progress);
      }
    } catch (error) {
      console.error('Error marking session as completed:', error);
    }
  }

  private static getDefaultProgress(): UserProgress {
    return {
      userId: 'legacy-user',
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      completedSessions: [],
      favoriteCategories: [],
    };
  }
}

/**
 * NOTA: Este servicio se mantiene para compatibilidad con código legacy.
 * Para nuevas funcionalidades, usa:
 * - AudioStorageService: Para gestionar audios
 * - LessonStorageService: Para gestionar lecciones
 * - UserStorageService: Para gestionar usuarios
 */
