import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Audio } from 'expo-av';

import { Button } from '../components/Button';
import { MEDITATION_SESSIONS } from '../constants';
import { StorageService } from '../services/StorageService';
import { DatabaseService } from '../services/DatabaseService';
import { AuthService } from '../services/AuthService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';

type MeditationScreenRouteProp = RouteProp<RootStackParamList, 'Meditation'>;
type MeditationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Meditation'>;

interface Props {
  route: MeditationScreenRouteProp;
  navigation: MeditationScreenNavigationProp;
}

const MeditationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { theme } = useTheme();
  const { sessionId } = route.params;
  const [session, setSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const foundSession = MEDITATION_SESSIONS.find(s => s.id === sessionId);
    if (foundSession) {
      setSession(foundSession);
      setDuration(foundSession.duration * 60 * 1000); // Configurar duración desde el inicio
    }
  }, [sessionId]);

  // Auto-iniciar la sesión cuando se carga
  useEffect(() => {
    if (session && !isPlaying && currentTime === 0) {
      // Pequeño delay para asegurar que la UI se renderice primero
      const timer = setTimeout(() => {
        loadSound();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [session]);

  // Interceptar el botón de atrás
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Si la sesión está completada, dejar salir sin confirmación
      if (currentTime >= duration && duration > 0) {
        return;
      }

      // Prevenir la acción por defecto
      e.preventDefault();

      // Mostrar confirmación
      Alert.alert(
        '¿Salir de la lección?',
        'El progreso no se guardará y esta sesión no contará para ganar betterflies.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: () => {
              // Limpiar audio si existe
              if (sound) {
                sound.unloadAsync();
              }
              if (intervalId) {
                clearInterval(intervalId);
              }
              // Permitir la navegación
              navigation.dispatch(e.data.action);
            },
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, currentTime, duration, sound, intervalId]);

  useEffect(() => {
    return () => {
      // Limpiar al desmontar el componente
      if (sound) {
        sound.unloadAsync();
      }
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [sound, intervalId]);

  const playSound = async () => {
    try {
      if (sound) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pauseSound = async () => {
    try {
      if (sound) {
        await sound.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  };

  const loadSound = async () => {
    try {
      // Verificar que la sesión tenga un archivo de audio
      if (!session.audioFile) {
        console.warn('No audio file found for session, simulating playback');
        simulateAudioPlayback();
        return;
      }

      // Configurar el modo de audio
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Cargar el archivo de audio específico de la sesión
      const { sound: newSound } = await Audio.Sound.createAsync(
        session.audioFile,
        { shouldPlay: true } // Iniciar reproducción automáticamente
      );

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying || false);

          if (status.didJustFinish) {
            setIsPlaying(false);
            completeSession();
          }
        }
      });

      setSound(newSound);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error loading sound:', error);
      console.error('Session ID:', session?.id);
      console.error('Audio file:', session?.audioFile);
      // Si hay error al cargar el audio, simular la reproducción
      Alert.alert(
        'Audio no disponible',
        'El archivo de audio no se pudo cargar. Se simulará la sesión.',
        [{ text: 'OK', onPress: () => simulateAudioPlayback() }]
      );
    }
  };

  const simulateAudioPlayback = () => {
    setIsPlaying(true);
    setDuration(session.duration * 60 * 1000); // Convert minutes to milliseconds

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= session.duration * 60 * 1000) {
          clearInterval(interval);
          setIntervalId(null);
          setIsPlaying(false);
          completeSession();
          return session.duration * 60 * 1000;
        }
        return prev + 1000;
      });
    }, 1000);
    
    setIntervalId(interval);
  };

  const pauseSimulation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsPlaying(false);
  };

  const resumeSimulation = () => {
    setIsPlaying(true);
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= duration) {
          clearInterval(interval);
          setIntervalId(null);
          setIsPlaying(false);
          completeSession();
          return duration;
        }
        return prev + 1000;
      });
    }, 1000);
    
    setIntervalId(interval);
  };

  const completeSession = async () => {
    try {
      // Obtener usuario actual
      const currentUser = await AuthService.getCurrentLoggedUser();
      if (!currentUser) {
        Alert.alert('Error', 'No se pudo encontrar el usuario actual');
        return;
      }

      // Calcular minutos de la sesión
      const sessionMinutes = session.duration; // Ya está en minutos

      // Obtener el ID de la categoría
      const categoryId = session.category.id;

      // Completar lección y calcular puntos
      const result = await DatabaseService.completeLesson(
        currentUser.email, 
        sessionMinutes, 
        categoryId
      );

      if (!result) {
        Alert.alert('Error', 'No se pudo registrar la sesión');
        return;
      }

      const { betterfliesEarned } = result;

      // Marcar como completada (legacy)
      await StorageService.markSessionAsCompleted(session.id);

      // Mostrar resumen con puntos ganados
      Alert.alert(
        '¡Sesión Completada! 🎉',
        `¡Excelente trabajo!\n\n` +
        `⏱️ Minutos: ${sessionMinutes.toFixed(2)}\n` +
        `🦋 Betterflies ganadas: +${betterfliesEarned}\n` +
        `🔥 Racha: ${result.user.streak} días`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error al completar sesión:', error);
      Alert.alert('Error', 'Hubo un problema al guardar tu progreso');
    }
  };

  const handlePlayPause = async () => {
    // Si no hay sonido cargado y no está reproduciendo, cargar audio
    if (!sound && !isPlaying && currentTime === 0) {
      await loadSound();
      return;
    }

    // Si está reproduciendo, pausar
    if (isPlaying) {
      if (sound) {
        await pauseSound();
      } else {
        pauseSimulation();
      }
    } else {
      // Si está pausado, reanudar
      if (sound) {
        await playSound();
      } else {
        resumeSimulation();
      }
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const styles = createStyles(theme);

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Sesión no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{session.title}</Text>
        <Text style={styles.category}>
          {session.category.icon} {session.category.name}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.timerContainer}>
          <View style={styles.timer}>
            <Text style={styles.timerText}>
              {formatTime(currentTime)}
            </Text>
            <Text style={styles.timerSubtext}>
              de {formatTime(duration)}
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.playButton, isPlaying && styles.pauseButton]}
            onPress={handlePlayPause}
            activeOpacity={0.7}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.controlLabel}>
            {isPlaying ? 'Pausar' : currentTime > 0 ? 'Reanudar' : 'Comenzar'}
          </Text>
        </View>

        <View style={styles.sessionInfo}>
          <Text style={styles.description}>{session.description}</Text>
          <Text style={styles.duration}>
            Duración: {(session.duration || 0).toFixed(2)} minutos
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  text: {
    color: theme.text,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: theme.card,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: theme.textSecondary,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  timer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  timerSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
  },
  progressBar: {
    width: 250,
    height: 4,
    backgroundColor: theme.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: 2,
  },
  controls: {
    marginBottom: 40,
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pauseButton: {
    backgroundColor: theme.error,
  },
  playButtonText: {
    fontSize: 32,
  },
  controlLabel: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  sessionInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  duration: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
});

export default MeditationScreen;
