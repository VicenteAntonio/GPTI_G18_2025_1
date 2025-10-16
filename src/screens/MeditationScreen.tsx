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
import { RootStackParamList } from '../navigation/AppNavigator';

type MeditationScreenRouteProp = RouteProp<RootStackParamList, 'Meditation'>;
type MeditationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Meditation'>;

interface Props {
  route: MeditationScreenRouteProp;
  navigation: MeditationScreenNavigationProp;
}

const MeditationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { sessionId } = route.params;
  const [session, setSession] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  useEffect(() => {
    const foundSession = MEDITATION_SESSIONS.find(s => s.id === sessionId);
    if (foundSession) {
      setSession(foundSession);
    }
  }, [sessionId]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

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
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../../assets/meditation-audio.mp3'), // Placeholder audio file
        { shouldPlay: false }
      );

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          setDuration(status.durationMillis || 0);

          if (status.didJustFinish) {
            setIsPlaying(false);
            completeSession();
          }
        }
      });

      setSound(newSound);
    } catch (error) {
      console.error('Error loading sound:', error);
      // For demo purposes, we'll simulate audio playback
      simulateAudioPlayback();
    }
  };

  const simulateAudioPlayback = () => {
    setIsPlaying(true);
    setDuration(session.duration * 60 * 1000); // Convert minutes to milliseconds

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= session.duration * 60 * 1000) {
          clearInterval(interval);
          setIsPlaying(false);
          completeSession();
          return session.duration * 60 * 1000;
        }
        return prev + 1000;
      });
    }, 1000);
  };

  const completeSession = async () => {
    Alert.alert(
      '¡Sesión Completada!',
      'Has completado tu sesión de meditación. ¡Excelente trabajo!',
      [
        {
          text: 'OK',
          onPress: async () => {
            await StorageService.markSessionAsCompleted(session.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handlePlayPause = async () => {
    if (!sound && !isPlaying) {
      await loadSound();
    } else if (isPlaying) {
      await pauseSound();
    } else {
      await playSound();
    }
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Sesión no encontrada</Text>
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
              {formatTime(currentTime)} / {formatTime(duration)}
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
            style={styles.playButton}
            onPress={handlePlayPause}
          >
            <Text style={styles.playButtonText}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sessionInfo}>
          <Text style={styles.description}>{session.description}</Text>
          <Text style={styles.duration}>Duración: {session.duration} minutos</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
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
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#7F8C8D',
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
  },
  timer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBar: {
    width: 250,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ECDC4',
    borderRadius: 2,
  },
  controls: {
    marginBottom: 40,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 32,
  },
  sessionInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  duration: {
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500',
  },
});

export default MeditationScreen;
