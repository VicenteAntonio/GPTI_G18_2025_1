import AsyncStorage from '@react-native-async-storage/async-storage';
import { DatabaseService } from './DatabaseService';
import { User } from '../types';

const AUTH_KEY = '@auth_session';

export interface AuthSession {
  isLoggedIn: boolean;
  userEmail: string | null;
}

/**
 * Servicio de autenticación
 */
export class AuthService {
  /**
   * Verificar si hay un usuario logueado
   */
  static async isUserLoggedIn(): Promise<boolean> {
    try {
      const session = await this.getSession();
      return session.isLoggedIn && session.userEmail !== null;
    } catch (error) {
      console.error('Error verificando sesión:', error);
      return false;
    }
  }

  /**
   * Obtener la sesión actual
   */
  static async getSession(): Promise<AuthSession> {
    try {
      const data = await AsyncStorage.getItem(AUTH_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return { isLoggedIn: false, userEmail: null };
    } catch (error) {
      console.error('Error obteniendo sesión:', error);
      return { isLoggedIn: false, userEmail: null };
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await DatabaseService.getUserByEmail(email);
      
      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      if (user.password !== password) {
        return { success: false, error: 'Contraseña incorrecta' };
      }

      // Crear sesión
      const session: AuthSession = {
        isLoggedIn: true,
        userEmail: email,
      };

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
      await DatabaseService.setCurrentUser(email);

      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error al iniciar sesión' };
    }
  }

  /**
   * Registrar nuevo usuario
   */
  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await DatabaseService.getUserByEmail(email);
      if (existingUser) {
        return { success: false, error: 'El email ya está registrado' };
      }

      // Crear nuevo usuario
      const newUser: User = {
        username,
        email,
        password,
        streak: 0,
        relaxationCompleted: 0,
        selfAwarenessCompleted: 0,
        concentrationCompleted: 0,
        longestStreak: 0,
        achievements: [],
      };

      await DatabaseService.saveUser(newUser);

      // Iniciar sesión automáticamente
      const session: AuthSession = {
        isLoggedIn: true,
        userEmail: email,
      };

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
      await DatabaseService.setCurrentUser(email);

      return { success: true };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(): Promise<void> {
    try {
      const session: AuthSession = {
        isLoggedIn: false,
        userEmail: null,
      };
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
    } catch (error) {
      console.error('Error cerrando sesión:', error);
    }
  }

  /**
   * Obtener usuario actual logueado
   */
  static async getCurrentLoggedUser(): Promise<User | null> {
    try {
      const session = await this.getSession();
      if (session.isLoggedIn && session.userEmail) {
        return await DatabaseService.getUserByEmail(session.userEmail);
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }
}

