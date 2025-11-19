import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@meditation_theme';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  // Colores de fondo
  background: string;
  surface: string;
  card: string;
  
  // Colores de texto
  text: string;
  textSecondary: string;
  textDisabled: string;
  
  // Colores primarios
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Colores de estado
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Colores de borde y separadores
  border: string;
  divider: string;
  
  // Colores especiales
  shadow: string;
  overlay: string;
  
  // Colores de botones
  buttonBackground: string;
  buttonText: string;
  buttonDisabled: string;
  
  // Modo actual
  isDark: boolean;
}

const lightTheme: Theme = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textDisabled: '#95A5A6',
  
  primary: '#4ECDC4',
  primaryLight: '#6EDDD5',
  primaryDark: '#3EBDB4',
  
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#FF6B6B',
  info: '#3498DB',
  
  border: '#E0E0E0',
  divider: '#ECEFF1',
  
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  buttonBackground: '#4ECDC4',
  buttonText: '#FFFFFF',
  buttonDisabled: '#D1D5DB',
  
  isDark: false,
};

const darkTheme: Theme = {
  background: '#121212',
  surface: '#1E1E1E',
  card: '#2C2C2C',
  
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textDisabled: '#666666',
  
  primary: '#4ECDC4',
  primaryLight: '#6EDDD5',
  primaryDark: '#3EBDB4',
  
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#FF6B6B',
  info: '#3498DB',
  
  border: '#3C3C3C',
  divider: '#2C2C2C',
  
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.8)',
  
  buttonBackground: '#4ECDC4',
  buttonText: '#FFFFFF',
  buttonDisabled: '#4C4C4C',
  
  isDark: true,
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setThemeModeState(savedTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  // Mientras carga el tema, no renderizar nada para evitar un "flash" de contenido
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

