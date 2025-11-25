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
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { NotificationService } from '../services/NotificationService';
import { EmailService } from '../services/EmailService';
import { AuthService } from '../services/AuthService';
import { DatabaseService } from '../services/DatabaseService';
import { useTheme } from '../contexts/ThemeContext';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

type TimePickerMode = 'push' | 'email';
type InfoModalType = 'about' | 'help' | 'privacy' | null;

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
  
  // Estados para modales de información
  const [infoModalVisible, setInfoModalVisible] = useState<InfoModalType>(null);

  // Estados para edición de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Cargar email y nombre de usuario actual
      const user = await AuthService.getCurrentLoggedUser();
      if (user) {
        setCurrentUserEmail(user.email);
        setCurrentUsername(user.username);
        setNewUsername(user.username);
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
    setInfoModalVisible('about');
  };

  const handlePrivacyPolicy = () => {
    setInfoModalVisible('privacy');
  };

  const handleHelp = () => {
    setInfoModalVisible('help');
  };

  const closeInfoModal = () => {
    setInfoModalVisible(null);
  };

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      Alert.alert('Error', 'El nombre de usuario no puede estar vacío');
      return;
    }

    try {
      const user = await AuthService.getCurrentLoggedUser();
      if (user) {
        user.username = newUsername.trim();
        await DatabaseService.saveUser(user);
        setCurrentUsername(newUsername.trim());
        setIsEditingProfile(false);
        Alert.alert('Éxito', 'Nombre de usuario actualizado correctamente');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      Alert.alert('Error', 'No se pudo actualizar el nombre de usuario');
    }
  };

  const handleSavePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos de contraseña');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    Alert.alert(
      'Confirmar cambio',
      '¿Estás seguro de que quieres cambiar tu contraseña?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cambiar',
          onPress: async () => {
            try {
              const user = await AuthService.getCurrentLoggedUser();
              if (user) {
                user.password = newPassword;
                await DatabaseService.saveUser(user);
                setNewPassword('');
                setConfirmPassword('');
                Alert.alert('Éxito', 'Contraseña actualizada correctamente');
              }
            } catch (error) {
              console.error('Error updating password:', error);
              Alert.alert('Error', 'No se pudo actualizar la contraseña');
            }
          },
        },
      ]
    );
  };

  const handleCancelEdit = () => {
    setNewUsername(currentUsername);
    setIsEditingProfile(false);
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

        {/* Sección de Perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Perfil de Usuario</Text>
          
          {/* Editar nombre de usuario */}
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Nombre de Usuario</Text>
            <View style={styles.profileInputContainer}>
              <TextInput
                style={[styles.profileInput, isEditingProfile && styles.profileInputActive]}
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Tu nombre de usuario"
                placeholderTextColor={theme.textSecondary}
                editable={isEditingProfile}
                autoCapitalize="none"
              />
            </View>
            {!isEditingProfile ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditingProfile(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editButtonsContainer}>
                <TouchableOpacity
                  style={[styles.editButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                  activeOpacity={0.7}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.editButton, styles.saveButton]}
                  onPress={handleSaveUsername}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Email (solo lectura) */}
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Email</Text>
            <View style={styles.profileInputContainer}>
              <TextInput
                style={[styles.profileInput, styles.profileInputDisabled]}
                value={currentUserEmail}
                editable={false}
                placeholderTextColor={theme.textSecondary}
              />
            </View>
            <Text style={styles.readOnlyLabel}>Solo lectura</Text>
          </View>

          {/* Cambiar contraseña */}
          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Cambiar Contraseña</Text>
            <View style={styles.profileInputContainer}>
              <TextInput
                style={styles.profileInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nueva contraseña"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.profileItem}>
            <Text style={styles.profileLabel}>Confirmar Contraseña</Text>
            <View style={styles.profileInputContainer}>
              <TextInput
                style={styles.profileInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirma la nueva contraseña"
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          {(newPassword || confirmPassword) && (
            <TouchableOpacity
              style={styles.savePasswordButton}
              onPress={handleSavePassword}
              activeOpacity={0.7}
            >
              <Text style={styles.savePasswordButtonText}>Guardar Nueva Contraseña</Text>
            </TouchableOpacity>
          )}
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

      {/* Modal de Información - Acerca de */}
      <Modal
        visible={infoModalVisible === 'about'}
        transparent={true}
        animationType="fade"
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalIcon}>ℹ️</Text>
              <Text style={styles.infoModalTitle}>Acerca de</Text>
            </View>
            
            <ScrollView style={styles.infoModalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Aplicación</Text>
                <Text style={styles.infoText}>Bot de Meditación</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Versión</Text>
                <Text style={styles.infoText}>1.0.0</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Desarrollado por</Text>
                <Text style={styles.infoText}>Betterfly</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Descripción</Text>
                <Text style={styles.infoText}>
                  Una aplicación diseñada para mejorar tu bienestar mental a través de la meditación guiada. 
                  Ofrecemos diversas categorías de meditación adaptadas a tus necesidades, desde manejo del 
                  estrés hasta mejora del sueño.
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Características</Text>
                <Text style={styles.infoBullet}>• Sesiones de meditación guiadas</Text>
                <Text style={styles.infoBullet}>• Múltiples categorías (Estrés, Ansiedad, Sueño, etc.)</Text>
                <Text style={styles.infoBullet}>• Seguimiento de progreso personalizado</Text>
                <Text style={styles.infoBullet}>• Recordatorios diarios por push y email</Text>
                <Text style={styles.infoBullet}>• Modo oscuro para meditar de noche</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Tecnología</Text>
                <Text style={styles.infoText}>React Native • TypeScript • Expo</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={closeInfoModal}
              activeOpacity={0.7}
            >
              <Text style={styles.infoModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Información - Ayuda */}
      <Modal
        visible={infoModalVisible === 'help'}
        transparent={true}
        animationType="fade"
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalIcon}>❓</Text>
              <Text style={styles.infoModalTitle}>Ayuda</Text>
            </View>
            
            <ScrollView style={styles.infoModalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>¿Cómo usar la aplicación?</Text>
                <Text style={styles.infoText}>
                  Sigue estos pasos para comenzar tu viaje de meditación:
                </Text>
              </View>

              <View style={styles.helpStep}>
                <View style={styles.helpStepNumber}>
                  <Text style={styles.helpStepNumberText}>1</Text>
                </View>
                <View style={styles.helpStepContent}>
                  <Text style={styles.helpStepTitle}>Explora las Categorías</Text>
                  <Text style={styles.helpStepDescription}>
                    En la pantalla de inicio, encontrarás diferentes categorías de meditación 
                    como Estrés, Ansiedad, Sueño y más.
                  </Text>
                </View>
              </View>

              <View style={styles.helpStep}>
                <View style={styles.helpStepNumber}>
                  <Text style={styles.helpStepNumberText}>2</Text>
                </View>
                <View style={styles.helpStepContent}>
                  <Text style={styles.helpStepTitle}>Selecciona una Sesión</Text>
                  <Text style={styles.helpStepDescription}>
                    Elige una sesión que se adapte a tu necesidad actual. Cada sesión tiene 
                    una duración y descripción específica.
                  </Text>
                </View>
              </View>

              <View style={styles.helpStep}>
                <View style={styles.helpStepNumber}>
                  <Text style={styles.helpStepNumberText}>3</Text>
                </View>
                <View style={styles.helpStepContent}>
                  <Text style={styles.helpStepTitle}>Completa la Meditación</Text>
                  <Text style={styles.helpStepDescription}>
                    Sigue las instrucciones guiadas y completa la sesión. Tu progreso se 
                    guardará automáticamente.
                  </Text>
                </View>
              </View>

              <View style={styles.helpStep}>
                <View style={styles.helpStepNumber}>
                  <Text style={styles.helpStepNumberText}>4</Text>
                </View>
                <View style={styles.helpStepContent}>
                  <Text style={styles.helpStepTitle}>Revisa tu Progreso</Text>
                  <Text style={styles.helpStepDescription}>
                    Ve a tu perfil para ver estadísticas detalladas de tus sesiones 
                    completadas y tu progreso general.
                  </Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Consejos</Text>
                <Text style={styles.infoBullet}>• Busca un lugar tranquilo para meditar</Text>
                <Text style={styles.infoBullet}>• Usa auriculares para una mejor experiencia</Text>
                <Text style={styles.infoBullet}>• Medita a la misma hora cada día</Text>
                <Text style={styles.infoBullet}>• Sé paciente contigo mismo</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>¿Necesitas más ayuda?</Text>
                <Text style={styles.infoText}>
                  Contacto: support@botmeditacion.com
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={closeInfoModal}
              activeOpacity={0.7}
            >
              <Text style={styles.infoModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Información - Privacidad */}
      <Modal
        visible={infoModalVisible === 'privacy'}
        transparent={true}
        animationType="fade"
        onRequestClose={closeInfoModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalContent}>
            <View style={styles.infoModalHeader}>
              <Text style={styles.infoModalIcon}>🔒</Text>
              <Text style={styles.infoModalTitle}>Política de Privacidad</Text>
            </View>
            
            <ScrollView style={styles.infoModalScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Tu Privacidad es Importante</Text>
                <Text style={styles.infoText}>
                  En Bot de Meditación, nos tomamos muy en serio la privacidad y seguridad 
                  de tus datos personales.
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Información que Recopilamos</Text>
                <Text style={styles.infoBullet}>• Email de registro</Text>
                <Text style={styles.infoBullet}>• Progreso de meditación y estadísticas</Text>
                <Text style={styles.infoBullet}>• Preferencias de notificaciones</Text>
                <Text style={styles.infoBullet}>• Configuración de la aplicación</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Cómo Usamos tu Información</Text>
                <Text style={styles.infoText}>
                  Utilizamos tu información únicamente para:
                </Text>
                <Text style={styles.infoBullet}>• Personalizar tu experiencia de meditación</Text>
                <Text style={styles.infoBullet}>• Enviarte recordatorios (si lo autorizas)</Text>
                <Text style={styles.infoBullet}>• Guardar tu progreso y estadísticas</Text>
                <Text style={styles.infoBullet}>• Mejorar nuestros servicios</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Protección de Datos</Text>
                <Text style={styles.infoBullet}>• Todos los datos se almacenan de forma segura</Text>
                <Text style={styles.infoBullet}>• No compartimos información con terceros</Text>
                <Text style={styles.infoBullet}>• No vendemos tus datos personales</Text>
                <Text style={styles.infoBullet}>• Puedes eliminar tu cuenta en cualquier momento</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Tus Derechos</Text>
                <Text style={styles.infoText}>
                  Tienes derecho a acceder, modificar o eliminar tus datos personales en 
                  cualquier momento. Para ejercer estos derechos, contáctanos.
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Cookies y Tecnologías Similares</Text>
                <Text style={styles.infoText}>
                  Utilizamos tecnologías de almacenamiento local para guardar tus preferencias 
                  y progreso en el dispositivo.
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>Contacto</Text>
                <Text style={styles.infoText}>
                  Para consultas sobre privacidad: privacy@botmeditacion.com
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoFootnote}>
                  Última actualización: Noviembre 2025
                </Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={closeInfoModal}
              activeOpacity={0.7}
            >
              <Text style={styles.infoModalButtonText}>Cerrar</Text>
            </TouchableOpacity>
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
  profileItem: {
    backgroundColor: theme.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 8,
  },
  profileInputContainer: {
    marginBottom: 8,
  },
  profileInput: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },
  profileInputActive: {
    borderColor: theme.primary,
    borderWidth: 2,
  },
  profileInputDisabled: {
    opacity: 0.6,
  },
  editButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: theme.primary,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  readOnlyLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  savePasswordButton: {
    backgroundColor: theme.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  savePasswordButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
  // Estilos de los modales de información
  infoModalContent: {
    backgroundColor: theme.card,
    borderRadius: 20,
    width: '95%',
    maxWidth: 600,
    height: '90%',
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  infoModalHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  infoModalIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  infoModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
  },
  infoModalScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  infoBullet: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 22,
    marginLeft: 8,
  },
  infoFootnote: {
    fontSize: 12,
    color: theme.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  helpStep: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  helpStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  helpStepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  helpStepContent: {
    flex: 1,
  },
  helpStepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 4,
  },
  helpStepDescription: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  infoModalButton: {
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  infoModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default SettingsScreen;
