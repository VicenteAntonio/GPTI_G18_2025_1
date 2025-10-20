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
  /**
   * @deprecated Usar completeLesson en su lugar
   * Función legacy para compatibilidad
   */
  static async updateUserProgress(
    email: string,
    lessonType: 'sleep' | 'relaxation' | 'selfAwareness'
  ): Promise<void> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return;

      // Incrementar el contador correspondiente
      if (lessonType === 'sleep') {
        user.sleepCompleted++;
      } else if (lessonType === 'relaxation') {
        user.relaxationCompleted++;
      } else if (lessonType === 'selfAwareness') {
        user.selfAwarenessCompleted++;
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

  /**
   * Obtener diferencia de días entre dos fechas
   */
  private static getDaysDifference(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Obtener fecha actual en formato YYYY-MM-DD
   */
  private static getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Verificar y resetear racha si han pasado 2 o más días
   */
  static async checkAndResetStreak(user: User): Promise<void> {
    try {
      if (!user.lastLessonDate) {
        // Primera vez, no hay nada que resetear
        return;
      }

      const today = this.getTodayDate();
      const daysPassed = this.getDaysDifference(user.lastLessonDate, today);

      // Si han pasado 2 o más días, resetear racha
      if (daysPassed >= 2) {
        const updatedUser: User = {
          ...user,
          streak: 0,
        };
        await this.saveUser(updatedUser);
      }
    } catch (error) {
      console.error('Error verificando racha:', error);
    }
  }

  /**
   * Actualizar progreso del usuario al completar una lección
   * Fórmula betterflies: minutos × 2 + floor(racha / 3) + 1
   */
  static async completeLesson(
    userEmail: string, 
    lessonMinutes: number, 
    categoryId: string
  ): Promise<{
    user: User;
    betterfliesEarned: number;
  } | null> {
    try {
      const user = await this.getUserByEmail(userEmail);
      if (!user) return null;

      // Calcular minutos enteros
      const minutesInt = Math.floor(lessonMinutes);

      const today = this.getTodayDate();
      let newStreak = user.streak;

      // Actualizar racha solo si es un día diferente
      if (!user.lastLessonDate) {
        // Primera lección
        newStreak = 1;
      } else {
        const daysPassed = this.getDaysDifference(user.lastLessonDate, today);
        
        if (daysPassed === 1) {
          // Lección del día siguiente, incrementar racha
          newStreak = user.streak + 1;
        } else if (daysPassed >= 2) {
          // Pasaron 2 o más días, resetear racha
          newStreak = 1;
        }
        // Si daysPassed === 0 (mismo día), mantener racha actual
      }

      // Calcular betterflies ganadas: minutos × 2 + floor(racha / 3) + 1
      const betterfliesEarned = (minutesInt * 2) + Math.floor(newStreak / 3) + 1;

      // Incrementar contador de categoría
      let sleepCompleted = user.sleepCompleted;
      let relaxationCompleted = user.relaxationCompleted;
      let selfAwarenessCompleted = user.selfAwarenessCompleted;

      if (categoryId === 'sleep') {
        sleepCompleted += 1;
      } else if (categoryId === 'relaxation') {
        relaxationCompleted += 1;
      } else if (categoryId === 'selfawareness') {
        selfAwarenessCompleted += 1;
      }

      // Actualizar usuario
      const updatedUser: User = {
        ...user,
        totalSessions: user.totalSessions + 1,
        totalMinutes: user.totalMinutes + minutesInt,
        streak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        betterflies: user.betterflies + betterfliesEarned,
        sleepCompleted,
        relaxationCompleted,
        selfAwarenessCompleted,
        lastLessonDate: today,
      };

      await this.saveUser(updatedUser);
      return { user: updatedUser, betterfliesEarned };
    } catch (error) {
      console.error('Error completando lección:', error);
      return null;
    }
  }

  /**
   * Obtener la categoría favorita del usuario
   * Si hay empate, mantiene la categoría previa o la primera con mayor valor
   */
  static getFavoriteCategory(user: User): {
    name: string;
    icon: string;
    count: number;
  } | null {
    const categories = [
      { id: 'sleep', name: 'Sueño', icon: '😴', count: user.sleepCompleted },
      { id: 'relaxation', name: 'Relajación', icon: '🧘', count: user.relaxationCompleted },
      { id: 'selfawareness', name: 'Autoconciencia', icon: '🌸', count: user.selfAwarenessCompleted },
    ];

    // Encontrar el máximo
    const maxCount = Math.max(...categories.map(c => c.count));

    // Si ninguna tiene sesiones, retornar null
    if (maxCount === 0) return null;

    // Encontrar la primera categoría con el máximo (mantiene orden de prioridad)
    const favorite = categories.find(c => c.count === maxCount);

    return favorite || null;
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
      sleepCompleted: 0,
      relaxationCompleted: 0,
      selfAwarenessCompleted: 0,
      longestStreak: 0,
      achievements: [],
      betterflies: 0,
      totalSessions: 0,
      totalMinutes: 0,
      lastLessonDate: null,
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
        lessonId: 'sleep-1',
        lessonName: 'Sueño Profundo',
        lessonType: 'sueño',
        lessonTime: 15,
        lessonAudio: 'file:///sleep-1.mp3',
      },
      {
        lessonId: 'relaxation-1',
        lessonName: 'Relajación Matutina',
        lessonType: 'relajación',
        lessonTime: 10,
        lessonAudio: 'file:///relaxation-1.mp3',
      },
      {
        lessonId: 'selfawareness-1',
        lessonName: 'Consciencia Plena',
        lessonType: 'autoconciencia',
        lessonTime: 10,
        lessonAudio: 'file:///selfawareness-1.mp3',
      },
    ];

    for (const lesson of demoLessons) {
      await this.saveLesson(lesson);
    }
  }
}

