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
import { useTheme } from '../contexts/ThemeContext';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { theme, themeMode, setThemeMode } = useTheme();
  
  // Estados para las configuraciones
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Estados para el selector de hora
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [reminderTime, setReminderTime] = useState<{ hour: number; minute: number } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Verificar si hay un recordatorio activo
      const isActive = await NotificationService.isDailyReminderActive();
      setDailyReminderEnabled(isActive);
      
      if (isActive) {
        // Cargar la hora del recordatorio
        const time = await NotificationService.getDailyReminderTime();
        if (time) {
          setReminderTime(time);
          const date = new Date();
          date.setHours(time.hour, time.minute);
          setSelectedTime(date);
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
      
      // Cancelar recordatorio si está activo
      await NotificationService.cancelDailyReminder();
      setReminderTime(null);
    }
  };

  const handleDailyReminderToggle = async (value: boolean) => {
    if (value) {
      // Si se activa, mostrar el selector de hora
      setShowTimePicker(true);
    } else {
      // Si se desactiva, cancelar la notificación
      Alert.alert(
        'Desactivar Recordatorio',
        '¿Estás seguro de que quieres desactivar el recordatorio diario?',
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
    
    try {
      const success = await NotificationService.scheduleDailyReminder(hour, minute);
      
      if (success) {
        setDailyReminderEnabled(true);
        setReminderTime({ hour, minute });
        
        // Formatear la hora para mostrarla
        const formattedTime = formatTime(hour, minute);
        
        Alert.alert(
          'Recordatorio Configurado',
          `Recibirás un recordatorio diario a las ${formattedTime}`,
          [{ text: 'Ok' }]
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudo configurar el recordatorio. Asegúrate de haber otorgado permisos para notificaciones.',
          [{ text: 'Ok' }]
        );
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

  const handleEmailNotificationsToggle = (value: boolean) => {
    setEmailNotificationsEnabled(value);
  };

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
  };

  const handleDarkModeToggle = (value: boolean) => {
    setThemeMode(value ? 'dark' : 'light');
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
                Notificaciones por Email
              </Text>
              <Text style={[styles.settingDescription, !notificationsEnabled && styles.settingDescriptionDisabled]}>
                Recibe actualizaciones y recordatorios por correo electrónico
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
        </View>

        {/* Sección de Audio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Sonido</Text>
              <Text style={styles.settingDescription}>
                Reproduce sonidos de meditación
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={soundEnabled ? '#FFFFFF' : theme.surface}
            />
          </View>
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
              ¿A qué hora quieres recibir tu recordatorio diario?
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
