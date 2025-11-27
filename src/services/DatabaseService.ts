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
  // ========== UTILIDADES DE BASE DE DATOS ==========
  
  /**
   * Limpiar TODOS los datos de la base de datos (usuarios, lecciones, sesiones)
   * ⚠️ PRECAUCIÓN: Esta acción no se puede deshacer
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.LESSONS,
        STORAGE_KEYS.CURRENT_USER,
        // Legacy keys
        '@user_progress',
        '@completed_sessions',
      ]);
      console.log('✅ Base de datos limpiada completamente');
    } catch (error) {
      console.error('❌ Error limpiando base de datos:', error);
      throw error;
    }
  }

  /**
   * Limpiar solo los usuarios (mantiene lecciones y el usuario admin)
   */
  static async clearAllUsers(): Promise<void> {
    try {
      // Obtener todos los usuarios
      const allUsers = await this.getAllUsers();
      
      // Filtrar para mantener solo el usuario admin
      const adminEmail = 'admin@meditation.app';
      const adminUser = allUsers.find(user => user.email === adminEmail);
      
      // Si existe el admin, guardarlo; si no, mantener array vacío
      const usersToKeep = adminUser ? [adminUser] : [];
      
      // Guardar solo el usuario admin
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersToKeep));
      
      // Limpiar la sesión actual
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      
      // Limpiar legacy keys
      await AsyncStorage.multiRemove([
        '@user_progress',
        '@completed_sessions',
      ]);
      
      const deletedCount = allUsers.length - usersToKeep.length;
      console.log(`✅ ${deletedCount} usuario(s) eliminado(s), admin preservado`);
    } catch (error) {
      console.error('❌ Error eliminando usuarios:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas de la base de datos
   */
  static async getDatabaseStats(): Promise<{
    totalUsers: number;
    totalLessons: number;
    currentUser: string | null;
  }> {
    try {
      const users = await this.getAllUsers();
      const lessons = await this.getAllLessons();
      const currentUserEmail = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      
      return {
        totalUsers: users.length,
        totalLessons: lessons.length,
        currentUser: currentUserEmail,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalUsers: 0,
        totalLessons: 0,
        currentUser: null,
      };
    }
  }

  /**
   * Inicializar datos de la aplicación (seed)
   * Crea el usuario administrador si no existe
   */
  static async seedDatabase(): Promise<void> {
    try {
      // Primero migrar usuarios existentes
      await this.migrateUsersAddRole();
      
      // Verificar si ya existe un usuario admin
      const adminEmail = 'admin@meditation.app';
      const existingAdmin = await this.getUserByEmail(adminEmail);
      
      if (!existingAdmin) {
        // Crear usuario administrador
        const adminUser: User = {
          username: 'Administrador',
          email: adminEmail,
          password: 'admin123', // Cambiar en producción
          role: 'admin',
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
        
        await this.saveUser(adminUser);
        console.log('✅ Usuario administrador creado');
        console.log('   Email: admin@meditation.app');
        console.log('   Password: admin123');
      } else {
        console.log('✓ Usuario administrador ya existe');
      }
    } catch (error) {
      console.error('Error en seed de base de datos:', error);
    }
  }

  /**
   * Migrar usuarios existentes para agregar campo 'role' y validar campos numéricos
   * Esta función se ejecuta automáticamente en el seed
   */
  static async migrateUsersAddRole(): Promise<void> {
    try {
      const users = await this.getAllUsers();
      let migrated = 0;
      
      for (const user of users) {
        let needsUpdate = false;
        
        // Si el usuario no tiene el campo role, agregarlo
        if (!(user as any).role) {
          (user as any).role = 'user'; // Por defecto, usuarios normales
          needsUpdate = true;
        }
        
        // Validar y corregir totalMinutes
        if (user.totalMinutes == null || isNaN(user.totalMinutes)) {
          user.totalMinutes = 0;
          needsUpdate = true;
        }
        
        // Validar y corregir otros campos numéricos
        if (user.totalSessions == null || isNaN(user.totalSessions)) {
          user.totalSessions = 0;
          needsUpdate = true;
        }
        
        if (user.betterflies == null || isNaN(user.betterflies)) {
          user.betterflies = 0;
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await this.saveUser(user);
          migrated++;
        }
      }
      
      if (migrated > 0) {
        console.log(`✅ Migración: ${migrated} usuario(s) actualizados`);
      }
    } catch (error) {
      console.error('Error en migración de usuarios:', error);
    }
  }

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
   * Fórmula betterflies: floor(minutos) × 2 + floor(racha / 3) + 1
   * Nota: Los minutos se almacenan con 2 decimales, pero se usan enteros para betterflies
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

      // Redondear minutos a 2 decimales para consistencia
      const minutesRounded = Math.round(lessonMinutes * 100) / 100;

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
      // Usar minutos enteros para el cálculo de betterflies
      const minutesForBetterflies = Math.floor(minutesRounded);
      const betterfliesEarned = (minutesForBetterflies * 2) + Math.floor(newStreak / 3) + 1;

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
        totalMinutes: Math.round((user.totalMinutes + minutesRounded) * 100) / 100, // Mantener 2 decimales
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

