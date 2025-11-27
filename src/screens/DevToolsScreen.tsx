import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DatabaseService } from '../services/DatabaseService';
import { AuthService } from '../services/AuthService';
import { Button } from '../components/Button';
import { AdminGuard } from '../utils/AdminGuard';
import { RootStackParamList } from '../navigation/AppNavigator';

type DevToolsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

/**
 * Pantalla de herramientas de desarrollo
 * Solo accesible para usuarios administradores
 * Útil para limpiar la base de datos y ver estadísticas
 */
const DevToolsScreenContent: React.FC = () => {
  const navigation = useNavigation<DevToolsScreenNavigationProp>();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    currentUser: null as string | null,
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    loadStats();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    const user = await AuthService.getCurrentLoggedUser();
    if (user) {
      setCurrentUser(user.username);
    }
  };

  const loadStats = async () => {
    const dbStats = await DatabaseService.getDatabaseStats();
    setStats(dbStats);
  };

  const handleClearAllData = () => {
    Alert.alert(
      '⚠️ Limpiar TODA la Base de Datos',
      'Esto eliminará:\n\n' +
      '• Todos los usuarios\n' +
      '• Todas las lecciones\n' +
      '• Sesiones guardadas\n' +
      '• Progreso de usuarios\n\n' +
      '❌ ESTA ACCIÓN NO SE PUEDE DESHACER',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, limpiar TODO',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await DatabaseService.clearAllData();
              await loadStats();
              Alert.alert('✅ Éxito', 'Base de datos limpiada completamente');
            } catch (error) {
              Alert.alert('❌ Error', 'No se pudo limpiar la base de datos');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleClearUsers = () => {
    const nonAdminUsers = stats.totalUsers > 0 ? stats.totalUsers - 1 : 0;
    Alert.alert(
      '⚠️ Eliminar Todos los Usuarios',
      `Se eliminarán aproximadamente ${nonAdminUsers} usuario(s).\n\n` +
      'Esto incluye:\n' +
      '• Todos los usuarios registrados\n' +
      '• Sesión actual\n' +
      '• Progreso de usuarios\n\n' +
      '✅ El usuario administrador NO será eliminado\n' +
      '📚 Las lecciones se mantendrán\n\n' +
      '❌ ESTA ACCIÓN NO SE PUEDE DESHACER',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, eliminar usuarios',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await DatabaseService.clearAllUsers();
              await loadStats();
              Alert.alert('✅ Éxito', 'Usuarios eliminados (admin preservado)');
            } catch (error) {
              Alert.alert('❌ Error', 'No se pudo eliminar los usuarios');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleListUsers = async () => {
    setLoading(true);
    try {
      const users = await DatabaseService.getAllUsers();
      
      if (users.length === 0) {
        Alert.alert('📋 Usuarios', 'No hay usuarios registrados');
        return;
      }

      const userList = users.map((u, i) => 
        `${i + 1}. ${u.username} (${u.email})\n` +
        `   📊 ${u.totalSessions} sesiones | ${u.totalMinutes.toFixed(2)} min\n` +
        `   🔥 Racha: ${u.streak} | 🦋 ${u.betterflies} betterflies`
      ).join('\n\n');

      Alert.alert(
        `📋 Usuarios (${users.length})`,
        userList,
        [{ text: 'OK' }],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo obtener la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>🛠️ Herramientas de Desarrollo</Text>
          <Text style={styles.subtitle}>Gestión de Base de Datos</Text>
          {currentUser && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>👤 Admin: {currentUser}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>📊 Estadísticas</Text>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Usuarios:</Text>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Lecciones:</Text>
            <Text style={styles.statValue}>{stats.totalLessons}</Text>
          </View>
          
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Usuario actual:</Text>
            <Text style={styles.statValue}>
              {stats.currentUser || 'Ninguno'}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadStats}
            disabled={loading}
          >
            <Text style={styles.refreshButtonText}>
              🔄 Actualizar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>🔧 Acciones</Text>
          
          <Button
            title="📋 Listar Usuarios"
            onPress={handleListUsers}
            disabled={loading}
            style={styles.actionButton}
          />

          <Button
            title="🗑️ Eliminar Todos los Usuarios"
            onPress={handleClearUsers}
            disabled={loading}
            style={[styles.actionButton, styles.dangerButton]}
          />

          <Button
            title="💣 Limpiar TODA la Base de Datos"
            onPress={handleClearAllData}
            disabled={loading}
            style={[styles.actionButton, styles.criticalButton]}
          />
        </View>

        <View style={styles.warningContainer}>
          <Text style={styles.warningTitle}>⚠️ Advertencia</Text>
          <Text style={styles.warningText}>
            Esta pantalla es solo para desarrollo. Las acciones de limpieza 
            no se pueden deshacer. Úsala con precaución.
          </Text>
        </View>

        {/* Botón para volver al perfil */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>← Volver al Perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Componente principal con AdminGuard
const DevToolsScreen: React.FC = () => {
  return (
    <AdminGuard>
      <DevToolsScreenContent />
    </AdminGuard>
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
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  adminBadge: {
    marginTop: 12,
    backgroundColor: '#4ECDC4',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: 16,
    color: '#7F8C8D',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  refreshButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#4ECDC4',
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionsContainer: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButton: {
    marginBottom: 10,
  },
  dangerButton: {
    backgroundColor: '#FF6B6B',
  },
  criticalButton: {
    backgroundColor: '#E74C3C',
  },
  warningContainer: {
    backgroundColor: '#FFF3CD',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  backButtonContainer: {
    margin: 20,
    marginTop: 10,
    marginBottom: 30,
  },
  backButton: {
    backgroundColor: '#95A5A6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DevToolsScreen;

