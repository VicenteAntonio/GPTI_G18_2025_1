import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { MeditationCard } from '../components/MeditationCard';
import { Button } from '../components/Button';
import { MEDITATION_SESSIONS, MEDITATION_CATEGORIES } from '../constants';
import { StorageService } from '../services/StorageService';
import { AuthService } from '../services/AuthService';
import { MeditationSession, UserProgress, User } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    loadData();
  }, []);

  // Recargar datos cuando la pantalla recibe foco (después de completar una sesión)
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // Obtener usuario actual
      const currentUser = await AuthService.getCurrentLoggedUser();
      
      if (currentUser) {
        // Usar datos del usuario actual
        const progress = {
          totalSessions: currentUser.totalSessions || 0,
          totalMinutes: currentUser.totalMinutes || 0,
          currentStreak: currentUser.streak || 0,
        };
        setUserProgress(progress as any);
      } else {
        // Fallback al sistema legacy
        const progress = await StorageService.getUserProgress();
        setUserProgress(progress);
      }

      // Obtener sesiones completadas para marcarlas
      const completedSessions = await StorageService.getCompletedSessions();

      // Mark sessions as completed based on stored data
      const sessionsWithProgress = MEDITATION_SESSIONS.map(session => ({
        ...session,
        isCompleted: completedSessions.includes(session.id),
      }));

      setSessions(sessionsWithProgress);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSessionPress = (session: MeditationSession) => {
    navigation.navigate('Meditation', { sessionId: session.id });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}! 🌅</Text>
          <Text style={styles.subtitle}>Encuentra tu momento de paz</Text>

          {userProgress && (
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{userProgress.totalSessions}</Text>
                <Text style={styles.statLabel}>Sesiones</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>
                  {(userProgress.totalMinutes || 0).toFixed(2)}
                </Text>
                <Text style={styles.statLabel}>Minutos</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
                <Text style={styles.statLabel}>Racha</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categorías</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          >
            {MEDITATION_CATEGORIES.map((item) => (
              <View key={item.id} style={[styles.categoryChip, { backgroundColor: item.color }]}>
                <Text style={styles.categoryText}>{item.icon} {item.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sessionsContainer}>
          <Text style={styles.sectionTitle}>Sesiones Disponibles</Text>
          {sessions.map((session) => (
            <MeditationCard
              key={session.id}
              session={session}
              onPress={() => handleSessionPress(session)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
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
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
  categoriesContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 12,
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  sessionsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
});

export default HomeScreen;
