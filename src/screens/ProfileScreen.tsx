import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

import { Button } from '../components/Button';
import { StorageService } from '../services/StorageService';
import { UserProgress } from '../types';
import { MEDITATION_CATEGORIES } from '../constants';

const ProfileScreen: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    try {
      const progress = await StorageService.getUserProgress();
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const resetProgress = async () => {
    try {
      const defaultProgress = {
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        completedSessions: [],
        favoriteCategories: [],
      };
      await StorageService.saveUserProgress(defaultProgress);
      setUserProgress(defaultProgress);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  if (!userProgress) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Tu Progreso</Text>
          <Text style={styles.subtitle}>Sigue tu viaje de meditación</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.mainStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.totalSessions}</Text>
              <Text style={styles.statLabel}>Sesiones Totales</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutos Meditados</Text>
            </View>
          </View>

          <View style={styles.secondaryStats}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.currentStreak}</Text>
              <Text style={styles.statLabel}>Racha Actual</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{userProgress.longestStreak}</Text>
              <Text style={styles.statLabel}>Racha Más Larga</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorías Favoritas</Text>
          <View style={styles.categoriesContainer}>
            {MEDITATION_CATEGORIES.map((category) => (
              <View
                key={category.id}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: userProgress.favoriteCategories.includes(category.id)
                      ? category.color
                      : '#E0E0E0',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: userProgress.favoriteCategories.includes(category.id)
                        ? '#FFFFFF'
                        : '#7F8C8D',
                    },
                  ]}
                >
                  {category.icon} {category.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logros</Text>
          <View style={styles.achievementsContainer}>
            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>
                  {userProgress.totalSessions >= 10 ? 'Meditador Experimentado' : 'Principiante'}
                </Text>
                <Text style={styles.achievementDescription}>
                  {userProgress.totalSessions >= 10
                    ? 'Has completado 10 sesiones de meditación'
                    : 'Completa 10 sesiones para desbloquear este logro'}
                </Text>
              </View>
            </View>

            <View style={styles.achievement}>
              <Text style={styles.achievementIcon}>🔥</Text>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementTitle}>
                  {userProgress.longestStreak >= 7 ? 'Racha Semanal' : 'Mantén la Constancia'}
                </Text>
                <Text style={styles.achievementDescription}>
                  {userProgress.longestStreak >= 7
                    ? 'Has mantenido una racha de 7 días'
                    : 'Mantén una racha de 7 días para desbloquear este logro'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Button
            title="Reiniciar Progreso"
            variant="outline"
            onPress={resetProgress}
            style={styles.resetButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
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
    fontSize: 28,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statsContainer: {
    padding: 20,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  secondaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4ECDC4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  achievementsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievement: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#7F8C8D',
    lineHeight: 20,
  },
  resetButton: {
    marginTop: 20,
  },
});

export default ProfileScreen;
