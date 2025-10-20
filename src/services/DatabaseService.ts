import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Lesson } from '../types';

const STORAGE_KEYS = {
  USERS: '@users',
  LESSONS: '@lessons',
  CURRENT_USER: '@current_user',
};

/**
 * Servicio simple de base de datos
 */
export class DatabaseService {
  // ========== USUARIOS ==========
  
  /**
   * Guardar un usuario
   */
  static async saveUser(user: User): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const index = users.findIndex(u => u.email === user.email);
      
      if (index >= 0) {
        users[index] = user;
      } else {
        users.push(user);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  }

  /**
   * Obtener todos los usuarios
   */
  static async getAllUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  /**
   * Obtener usuario por email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.getAllUsers();
      return users.find(u => u.email === email) || null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  /**
   * Establecer usuario actual
   */
  static async setCurrentUser(email: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
    } catch (error) {
      console.error('Error estableciendo usuario actual:', error);
    }
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const email = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (email) {
        return await this.getUserByEmail(email);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  /**
   * Actualizar progreso del usuario
   */
  static async updateUserProgress(
    email: string,
    lessonType: 'relaxation' | 'selfAwareness' | 'concentration'
  ): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return;

      // Incrementar el contador correspondiente
      if (lessonType === 'relaxation') {
        user.relaxationCompleted++;
      } else if (lessonType === 'selfAwareness') {
        user.selfAwarenessCompleted++;
      } else if (lessonType === 'concentration') {
        user.concentrationCompleted++;
      }

      // Actualizar racha (simplificado: incrementa siempre)
      user.streak++;
      if (user.streak > user.longestStreak) {
        user.longestStreak = user.streak;
      }

      await this.saveUser(user);
    } catch (error) {
      console.error('Error actualizando progreso:', error);
    }
  }

  // ========== LECCIONES ==========

  /**
   * Guardar una lección
   */
  static async saveLesson(lesson: Lesson): Promise<void> {
    try {
      const lessons = await this.getAllLessons();
      const index = lessons.findIndex(l => l.lessonId === lesson.lessonId);
      
      if (index >= 0) {
        lessons[index] = lesson;
      } else {
        lessons.push(lesson);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(lessons));
    } catch (error) {
      console.error('Error guardando lección:', error);
    }
  }

  /**
   * Obtener todas las lecciones
   */
  static async getAllLessons(): Promise<Lesson[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LESSONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error obteniendo lecciones:', error);
      return [];
    }
  }

  /**
   * Obtener lección por ID
   */
  static async getLessonById(lessonId: string): Promise<Lesson | null> {
    try {
      const lessons = await this.getAllLessons();
      return lessons.find(l => l.lessonId === lessonId) || null;
    } catch (error) {
      console.error('Error obteniendo lección:', error);
      return null;
    }
  }

  /**
   * Obtener lecciones por tipo
   */
  static async getLessonsByType(lessonType: string): Promise<Lesson[]> {
    try {
      const lessons = await this.getAllLessons();
      return lessons.filter(l => l.lessonType === lessonType);
    } catch (error) {
      console.error('Error obteniendo lecciones por tipo:', error);
      return [];
    }
  }

  // ========== UTILIDADES ==========

  /**
   * Limpiar toda la base de datos
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.LESSONS,
        STORAGE_KEYS.CURRENT_USER,
      ]);
    } catch (error) {
      console.error('Error limpiando base de datos:', error);
    }
  }

  /**
   * Inicializar usuario de prueba
   */
  static async initDemoUser(): Promise<User> {
    const demoUser: User = {
      username: 'Usuario Demo',
      email: 'demo@meditacion.app',
      password: 'demo123',
      streak: 0,
      relaxationCompleted: 0,
      selfAwarenessCompleted: 0,
      concentrationCompleted: 0,
      longestStreak: 0,
      achievements: [],
    };

    await this.saveUser(demoUser);
    await this.setCurrentUser(demoUser.email);
    return demoUser;
  }

  /**
   * Inicializar lecciones de ejemplo
   */
  static async initDemoLessons(): Promise<void> {
    const demoLessons: Lesson[] = [
      {
        lessonId: 'relaxation-1',
        lessonName: 'Relajación Profunda',
        lessonType: 'relajación',
        lessonTime: 10,
        lessonAudio: 'file:///relaxation-1.mp3',
      },
      {
        lessonId: 'selfawareness-1',
        lessonName: 'Consciencia Plena',
        lessonType: 'autoconciencia',
        lessonTime: 8,
        lessonAudio: 'file:///selfawareness-1.mp3',
      },
      {
        lessonId: 'concentration-1',
        lessonName: 'Enfoque Mental',
        lessonType: 'concentración',
        lessonTime: 5,
        lessonAudio: 'file:///concentration-1.mp3',
      },
    ];

    for (const lesson of demoLessons) {
      await this.saveLesson(lesson);
    }
  }
}

