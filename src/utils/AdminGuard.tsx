import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthService } from '../services/AuthService';

/**
 * Guard para proteger rutas que solo pueden acceder administradores
 * Si el usuario no es admin, redirige al Home
 */
interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const navigation = useNavigation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const userIsAdmin = await AuthService.isCurrentUserAdmin();
      
      if (!userIsAdmin) {
        // Usuario no es admin, redirigir a Home
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as any }],
        });
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error('Error verificando acceso admin:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' as any }],
      });
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.text}>Verificando permisos...</Text>
      </View>
    );
  }

  if (!isAdmin) {
    return null; // No mostrar nada mientras redirige
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#7F8C8D',
  },
});

