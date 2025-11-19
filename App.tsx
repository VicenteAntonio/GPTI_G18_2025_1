import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppState as RNAppState } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { AuthService } from './src/services/AuthService';
import { DatabaseService } from './src/services/DatabaseService';
import { ThemeProvider } from './src/contexts/ThemeContext';

type AppState = 'splash' | 'login' | 'register' | 'app';

export default function App() {
  const [appState, setAppState] = useState<AppState>('splash');
  const [checkAuth, setCheckAuth] = useState(0);

  // Inicializar base de datos (seed) al montar la app
  useEffect(() => {
    const initializeDatabase = async () => {
      await DatabaseService.seedDatabase();
    };
    
    initializeDatabase();
  }, []);

  // Verificar sesión cuando la app vuelve al foreground
  useEffect(() => {
    const subscription = RNAppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active' && appState === 'app') {
        const isLoggedIn = await AuthService.isUserLoggedIn();
        if (!isLoggedIn) {
          setAppState('login');
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  // Verificar sesión periódicamente cuando la app está activa
  useEffect(() => {
    if (appState === 'app') {
      const interval = setInterval(async () => {
        const isLoggedIn = await AuthService.isUserLoggedIn();
        if (!isLoggedIn) {
          setAppState('login');
        }
      }, 1000); // Verificar cada segundo

      return () => clearInterval(interval);
    }
  }, [appState, checkAuth]);

  const handleSplashFinish = async () => {
    // Verificar si hay usuario logueado
    const isLoggedIn = await AuthService.isUserLoggedIn();
    
    if (isLoggedIn) {
      setAppState('app');
    } else {
      setAppState('login');
    }
  };

  const handleLoginSuccess = () => {
    setAppState('app');
    setCheckAuth(prev => prev + 1);
  };

  const handleRegisterSuccess = () => {
    setAppState('app');
    setCheckAuth(prev => prev + 1);
  };

  return (
    <ThemeProvider>
      {/* Splash Screen */}
      {appState === 'splash' && <SplashScreen onFinish={handleSplashFinish} />}

      {/* Login Screen */}
      {appState === 'login' && (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => setAppState('register')}
        />
      )}

      {/* Register Screen */}
      {appState === 'register' && (
        <RegisterScreen
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => setAppState('login')}
        />
      )}

      {/* Main App */}
      {appState === 'app' && (
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
            <StatusBar style="auto" />
          </NavigationContainer>
        </SafeAreaProvider>
      )}
    </ThemeProvider>
  );
}
