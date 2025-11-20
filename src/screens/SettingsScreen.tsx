import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NotificationService } from '../services/NotificationService';
import { EmailService } from '../services/EmailService';
import { AuthService } from '../services/AuthService';
import { useTheme } from '../contexts/ThemeContext';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type TimePickerMode = 'push' | 'email';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, themeMode, setThemeMode } = useTheme();
  
  // Estados para las configuraciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  
  // Estados para el selector de hora
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<TimePickerMode>('push');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [reminderTime, setReminderTime] = useState<{ hour: number; minute: number } | null>(null);
  const [emailReminderTime, setEmailReminderTime] = useState<{ hour: number; minute: number } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Cargar email del usuario actual
      const user = await AuthService.getCurrentLoggedUser();
      if (user) {
        setCurrentUserEmail(user.email);
      }

      // Verificar si hay un recordatorio push activo
      const isActive = await NotificationService.isDailyReminderActive();
      setDailyReminderEnabled(isActive);
      
      if (isActive) {
        // Cargar la hora del recordatorio push
        const time = await NotificationService.getDailyReminderTime();
        if (time) {
          setReminderTime(time);
          const date = new Date();
          date.setHours(time.hour, time.minute);
          setSelectedTime(date);
        }
      }

      // Verificar si hay un recordatorio por email activo
      const isEmailActive = await EmailService.isEmailReminderActive();
      setEmailNotificationsEnabled(isEmailActive);
      
      if (isEmailActive) {
        // Cargar la hora del recordatorio por email
        const emailTime = await EmailService.getEmailReminderTime();
        if (emailTime) {
          setEmailReminderTime({ hour: emailTime.hour, minute: emailTime.minute });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    
    // Si se desactivan las notificaciones, desactivar todas las demás opciones
    if (!value) {
      setDailyReminderEnabled(false);
      setEmailNotificationsEnabled(false);
      
      // Cancelar recordatorios si están activos
      await NotificationService.cancelDailyReminder();
      await EmailService.cancelEmailReminder();
      setReminderTime(null);
      setEmailReminderTime(null);
    }
  };

  const handleDailyReminderToggle = async (value: boolean) => {
    if (value) {
      // Si se activa, mostrar el selector de hora para notificación push
      setTimePickerMode('push');
      setShowTimePicker(true);
    } else {
      // Si se desactiva, cancelar la notificación
      Alert.alert(
        'Desactivar Recordatorio Push',
        '¿Estás seguro de que quieres desactivar el recordatorio diario por notificación?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Desactivar',
            style: 'destructive',
            onPress: async () => {
              await NotificationService.cancelDailyReminder();
              setDailyReminderEnabled(false);
              setReminderTime(null);
            },
          },
        ]
      );
    }
  };

  const handleEmailNotificationsToggle = async (value: boolean) => {
    if (value) {
      // Verificar que haya un email válido
      if (!currentUserEmail || !EmailService.validateEmail(currentUserEmail)) {
        Alert.alert(
          'Email No Disponible',
          'No se encontró un email válido en tu perfil. Por favor, asegúrate de tener un email registrado.',
          [{ text: 'Ok' }]
        );
        return;
      }
      
      // Si se activa, mostrar el selector de hora para email
      setTimePickerMode('email');
      setShowTimePicker(true);
    } else {
      // Si se desactiva, cancelar el recordatorio por email
      Alert.alert(
        'Desactivar Recordatorio por Email',
        '¿Estás seguro de que quieres desactivar el recordatorio diario por email?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Desactivar',
            style: 'destructive',
            onPress: async () => {
              await EmailService.cancelEmailReminder();
              setEmailNotificationsEnabled(false);
              setEmailReminderTime(null);
            },
          },
        ]
      );
    }
  };

  const handleTimeChange = (event: any, date?: Date) => {
    // En Android, el picker se cierra automáticamente
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      
      if (event.type === 'set' && date) {
        setSelectedTime(date);
        confirmTimeSelection(date);
      }
    } else {
      // En iOS, el usuario puede seguir cambiando la hora
      if (date) {
        setSelectedTime(date);
      }
    }
  };

  const confirmTimeSelection = async (date: Date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formattedTime = formatTime(hour, minute);
    
    try {
      if (timePickerMode === 'push') {
        // Configurar notificación push
        const success = await NotificationService.scheduleDailyReminder(hour, minute);
        
        if (success) {
          setDailyReminderEnabled(true);
          setReminderTime({ hour, minute });
          
          Alert.alert(
            'Recordatorio Push Configurado',
            `Recibirás una notificación push diaria a las ${formattedTime}`,
            [{ text: 'Ok' }]
          );
        } else {
          Alert.alert(
            'Error',
            'No se pudo configurar el recordatorio push. Asegúrate de haber otorgado permisos para notificaciones.',
            [{ text: 'Ok' }]
          );
        }
      } else if (timePickerMode === 'email') {
        // Configurar notificación por email
        const success = await EmailService.scheduleEmailReminder(hour, minute, currentUserEmail);
        
        if (success) {
          setEmailNotificationsEnabled(true);
          setEmailReminderTime({ hour, minute });
          
          Alert.alert(
            'Recordatorio por Email Configurado',
            `Recibirás un email de recordatorio diario a las ${formattedTime} en ${currentUserEmail}\n\nNOTA: Esta función requiere un backend activo para enviar emails reales.`,
            [{ text: 'Ok' }]
          );
        } else {
          Alert.alert(
            'Error',
            'No se pudo configurar el recordatorio por email.',
            [{ text: 'Ok' }]
          );
        }
      }
    } catch (error) {
      console.error('Error setting reminder:', error);
      Alert.alert(
        'Error',
        'Ocurrió un error al configurar el recordatorio',
        [{ text: 'Ok' }]
      );
    }
  };

  const handleTimePickerCancel = () => {
    setShowTimePicker(false);
  };

  const handleTimePickerConfirm = () => {
    setShowTimePicker(false);
    confirmTimeSelection(selectedTime);
  };

  const formatTime = (hour: number, minute: number): string => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleDarkModeToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
  };

  const handleTestNotification = async () => {
    Alert.alert(
      '🔔 Probar Notificaciones',
      '¿Cuándo quieres recibir la notificación de prueba?',
      [
        {
          text: '5 segundos',
          onPress: async () => {
            await NotificationService.scheduleTestNotificationInMinutes(5/60);
            Alert.alert(
              'Notificación Programada',
              '¡Espera 5 segundos! Mantén la app abierta.',
              [{ text: 'Ok' }]
            );
          },
        },
        {
          text: '30 segundos',
          onPress: async () => {
            await NotificationService.scheduleTestNotificationInMinutes(0.5);
            Alert.alert(
              'Notificación Programada',
              '¡Espera 30 segundos! Mantén la app abierta.',
              [{ text: 'Ok' }]
            );
          },
        },
        {
          text: '1 minuto',
          onPress: async () => {
            await NotificationService.scheduleTestNotificationInMinutes(1);
            Alert.alert(
              'Notificación Programada',
              '¡Espera 1 minuto! Puedes minimizar la app.',
              [{ text: 'Ok' }]
            );
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Resetear Progreso',
      '¿Estás seguro de que quieres resetear todo tu progreso? Esta acción no se puede deshacer.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Resetear',
          style: 'destructive',
          onPress: async () => {
            Alert.alert('Info', 'Esta función estará disponible próximamente.');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'Acerca de',
      'Bot de Meditación v1.0\n\nDesarrollado por GPTI Grupo 18\n\nUna aplicación para mejorar tu bienestar mental a través de la meditación guiada.',
      [{ text: 'Ok' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Política de Privacidad',
      'Tus datos son privados y seguros. No compartimos información personal con terceros.',
      [{ text: 'Ok' }]
    );
  };

  const handleHelp = () => {
    Alert.alert(
      'Ayuda',
      '¿Necesitas ayuda?\n\n1. Selecciona una categoría en Inicio\n2. Elige una sesión de meditación\n3. Completa la meditación\n4. Revisa tu progreso en Perfil\n\nContacto: support@botmeditacion.com',
      [{ text: 'Ok' }]
    );
  };

  const styles = createStyles(theme, notificationsEnabled);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sección de Notificaciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificaciones</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notificaciones</Text>
              <Text style={styles.settingDescription}>
                Recibe notificaciones de la aplicación
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : theme.surface}
            />
          </View>

          <View style={[styles.settingItem, !notificationsEnabled && styles.settingItemDisabled]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, !notificationsEnabled && styles.settingLabelDisabled]}>
                Recordatorio Diario
              </Text>
              <Text style={[styles.settingDescription, !notificationsEnabled && styles.settingDescriptionDisabled]}>
                {reminderTime 
                  ? `Configurado para las ${formatTime(reminderTime.hour, reminderTime.minute)}`
                  : 'Recibe un recordatorio para meditar cada día'}
              </Text>
            </View>
            <Switch
              value={dailyReminderEnabled}
              onValueChange={handleDailyReminderToggle}
              disabled={!notificationsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={dailyReminderEnabled ? '#FFFFFF' : theme.surface}
            />
          </View>

          <View style={[styles.settingItem, !notificationsEnabled && styles.settingItemDisabled]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, !notificationsEnabled && styles.settingLabelDisabled]}>
                Recordatorio por Email
              </Text>
              <Text style={[styles.settingDescription, !notificationsEnabled && styles.settingDescriptionDisabled]}>
                {emailReminderTime 
                  ? `Configurado para las ${formatTime(emailReminderTime.hour, emailReminderTime.minute)} - ${currentUserEmail}`
                  : 'Recibe recordatorios diarios por correo electrónico'}
              </Text>
            </View>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={handleEmailNotificationsToggle}
              disabled={!notificationsEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={emailNotificationsEnabled ? '#FFFFFF' : theme.surface}
            />
          </View>

          {/* Botón de Prueba de Notificaciones - Solo visible si están activadas */}
          {notificationsEnabled && (
            <TouchableOpacity
              style={styles.testNotificationButton}
              onPress={handleTestNotification}
              activeOpacity={0.7}
            >
              <Text style={styles.testNotificationIcon}>🔔</Text>
              <View style={styles.testNotificationInfo}>
                <Text style={styles.testNotificationLabel}>Probar Notificación</Text>
                <Text style={styles.testNotificationDescription}>
                  Verifica que las notificaciones funcionen
                </Text>
              </View>
              <Text style={styles.testNotificationArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Sección de Apariencia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Apariencia</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Tema Oscuro</Text>
              <Text style={styles.settingDescription}>
                Usa colores oscuros en la interfaz
              </Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={themeMode === 'dark' ? '#FFFFFF' : theme.surface}
            />
          </View>
        </View>

        {/* Sección de Datos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleResetProgress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔄</Text>
            <View style={styles.actionButtonInfo}>
              <Text style={styles.actionButtonLabel}>Resetear Progreso</Text>
              <Text style={styles.actionButtonDescription}>
                Elimina todo tu historial de meditación
              </Text>
            </View>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sección de Información */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleAbout}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>ℹ️</Text>
            <View style={styles.actionButtonInfo}>
              <Text style={styles.actionButtonLabel}>Acerca de</Text>
              <Text style={styles.actionButtonDescription}>
                Versión e información de la app
              </Text>
            </View>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleHelp}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>❓</Text>
            <View style={styles.actionButtonInfo}>
              <Text style={styles.actionButtonLabel}>Ayuda</Text>
              <Text style={styles.actionButtonDescription}>
                Cómo usar la aplicación
              </Text>
            </View>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePrivacyPolicy}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonIcon}>🔒</Text>
            <View style={styles.actionButtonInfo}>
              <Text style={styles.actionButtonLabel}>Privacidad</Text>
              <Text style={styles.actionButtonDescription}>
                Política de privacidad
              </Text>
            </View>
            <Text style={styles.actionButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bot de Meditación v1.0</Text>
        </View>
      </ScrollView>

      {/* Modal con selector de hora */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={handleTimePickerCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona la Hora</Text>
            <Text style={styles.modalSubtitle}>
              {timePickerMode === 'push' 
                ? '¿A qué hora quieres recibir tu recordatorio por notificación?'
                : `¿A qué hora quieres recibir tu recordatorio por email a ${currentUserEmail}?`}
            </Text>
            
            <View style={styles.timePickerContainer}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                locale="es-ES"
              />
            </View>

            {Platform.OS === 'ios' && (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleTimePickerCancel}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleTimePickerConfirm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.modalButtonTextConfirm}>Aceptar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any, notificationsEnabled: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItemDisabled: {
    backgroundColor: theme.surface,
    opacity: 0.6,
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  settingLabelDisabled: {
    color: theme.textDisabled,
  },
  settingDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  settingDescriptionDisabled: {
    color: theme.textDisabled,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionButtonInfo: {
    flex: 1,
  },
  actionButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  actionButtonDescription: {
    fontSize: 13,
    color: theme.textSecondary,
    lineHeight: 18,
  },
  actionButtonArrow: {
    fontSize: 24,
    color: theme.border,
    fontWeight: '300',
  },
  testNotificationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  testNotificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  testNotificationInfo: {
    flex: 1,
  },
  testNotificationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  testNotificationDescription: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  testNotificationArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    opacity: 0.7,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  timePickerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: theme.surface,
  },
  modalButtonConfirm: {
    backgroundColor: theme.primary,
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  modalButtonTextConfirm: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SettingsScreen;
