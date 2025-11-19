import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Button } from '../components/Button';
import { StorageService } from '../services/StorageService';
import { AuthService } from '../services/AuthService';
import { DatabaseService } from '../services/DatabaseService';
import { User } from '../types';
import { MEDITATION_CATEGORIES } from '../constants';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  // Recargar datos cuando la pantalla reciba el foco (después de completar una sesión)
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    try {
      const user = await AuthService.getCurrentLoggedUser();
      setCurrentUser(user);
      
      // Verificar si el usuario es administrador
      const adminStatus = await AuthService.isCurrentUserAdmin();
      setIsAdmin(adminStatus);
      
      if (user) {
        // Usar datos del usuario directamente con validación
        const progress = {
          totalSessions: user.totalSessions || 0,
          totalMinutes: user.totalMinutes || 0, // Con 2 decimales
          currentStreak: user.streak || 0,
          longestStreak: user.longestStreak || 0,
        };
        setUserProgress(progress);
      } else {
        // Fallback al sistema legacy
        const progress = await StorageService.getUserProgress();
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            // Necesitamos forzar el reinicio completo de la app
            // Esto se manejará desde App.tsx
          },
        },
      ]
    );
  };

  const styles = createStyles(theme);

  if (!userProgress) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Text style={styles.userIcon}>👤</Text>
            <View style={styles.userDetails}>
              <Text style={styles.username}>{currentUser?.username || 'Usuario'}</Text>
              <Text style={styles.userEmail}>{currentUser?.email || ''}</Text>
            </View>
          </View>

          {/* Betterflies */}
          <View style={styles.betterfliesContainer}>
            <Image
              source={require('../../assets/Betterflie.png')}
              style={styles.betterflieIcon}
              resizeMode="contain"
            />
            <Text style={styles.betterfliesText}>{currentUser?.betterflies || 0}</Text>
            <Text style={styles.betterfliesLabel}>Betterflies</Text>
          </View>

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
              <Text style={styles.statNumber}>
                {(userProgress.totalMinutes || 0).toFixed(2)}
              </Text>
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
          <Text style={styles.sectionTitle}>Tipo de Sesión Favorito</Text>
          {currentUser && (() => {
            const favorite = DatabaseService.getFavoriteCategory(currentUser);
            if (!favorite) {
              return (
                <View style={styles.favoriteCard}>
                  <Text style={styles.favoriteEmptyText}>
                    Completa tu primera sesión para descubrir tu favorita ✨
                  </Text>
                </View>
              );
            }
            return (
              <View style={styles.favoriteCard}>
                <Text style={styles.favoriteIcon}>{favorite.icon}</Text>
                <View style={styles.favoriteInfo}>
                  <Text style={styles.favoriteName}>{favorite.name}</Text>
                  <Text style={styles.favoriteCount}>{favorite.count} sesiones completadas</Text>
                </View>
              </View>
            );
          })()}
          
          <View style={styles.categoryBreakdown}>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownIcon}>😴</Text>
              <Text style={styles.breakdownLabel}>Sueño</Text>
              <Text style={styles.breakdownCount}>{currentUser?.sleepCompleted || 0}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownIcon}>🧘</Text>
              <Text style={styles.breakdownLabel}>Relajación</Text>
              <Text style={styles.breakdownCount}>{currentUser?.relaxationCompleted || 0}</Text>
            </View>
            <View style={styles.breakdownItem}>
              <Text style={styles.breakdownIcon}>🌸</Text>
              <Text style={styles.breakdownLabel}>Autoconciencia</Text>
              <Text style={styles.breakdownCount}>{currentUser?.selfAwarenessCompleted || 0}</Text>
            </View>
          </View>
        </View>

        {/* TODO: Implementar sistema de logros */}
        {/* <View style={styles.section}>
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
        </View> */}

        {/* Botón de Configuración */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.8}
          >
            <Text style={styles.settingsButtonText}>⚙️ Configuración</Text>
            <Text style={styles.settingsButtonSubtext}>Personaliza tu experiencia</Text>
          </TouchableOpacity>
        </View>

        {/* Botón de Admin DevTools */}
        {isAdmin && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.devToolsButton}
              onPress={() => navigation.navigate('DevTools')}
              activeOpacity={0.8}
            >
              <Text style={styles.devToolsButtonText}>🛠️ Herramientas de Desarrollo</Text>
              <Text style={styles.devToolsButtonSubtext}>Acceso Administrador</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
          </TouchableOpacity>
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
  text: {
    color: theme.text,
  },
  scrollView: {
    flex: 1,
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.background,
    borderRadius: 12,
    width: '100%',
  },
  userIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  betterfliesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  betterflieIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  betterfliesText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2C3E50', // Color oscuro fijo para contrastar con el fondo amarillo
    marginRight: 8,
  },
  betterfliesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7F8C8D', // Color gris fijo para contrastar con el fondo amarillo
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
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
    backgroundColor: theme.card,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: theme.shadow,
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
    color: theme.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 4,
  },
  favoriteCount: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  favoriteEmptyText: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  categoryBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginBottom: 4,
  },
  breakdownCount: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
  },
  // TODO: Estilos para logros (descomentar cuando se implemente)
  // achievementsContainer: {
  //   backgroundColor: '#FFFFFF',
  //   borderRadius: 12,
  //   overflow: 'hidden',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // achievement: {
  //   flexDirection: 'row',
  //   padding: 16,
  //   alignItems: 'center',
  // },
  // achievementIcon: {
  //   fontSize: 32,
  //   marginRight: 16,
  // },
  // achievementContent: {
  //   flex: 1,
  // },
  // achievementTitle: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#2C3E50',
  //   marginBottom: 4,
  // },
  // achievementDescription: {
  //   fontSize: 14,
  //   color: '#7F8C8D',
  //   lineHeight: 20,
  // },
  settingsButton: {
    marginTop: 16,
    backgroundColor: '#95A5A6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#95A5A6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  settingsButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.9,
  },
  devToolsButton: {
    marginTop: 16,
    backgroundColor: '#4ECDC4',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  devToolsButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  devToolsButtonSubtext: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    opacity: 0.9,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
