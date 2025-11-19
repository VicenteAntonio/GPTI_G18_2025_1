import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_REMINDER_KEY = '@meditation_daily_reminder';
const DAILY_REMINDER_TIME_KEY = '@meditation_daily_reminder_time';
const DAILY_REMINDER_NOTIFICATION_ID = 'daily-meditation-reminder';

// Configurar cómo se manejan las notificaciones cuando la app está en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  /**
   * Solicita permisos para notificaciones push
   */
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si no hay permisos, solicitarlos
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // En Android, configurar el canal de notificaciones
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Recordatorios de Meditación',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4ECDC4',
          sound: 'default',
        });
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Programa una notificación diaria recurrente
   * NOTA: En Expo Go, las notificaciones recurrentes tienen limitaciones.
   * Para producción, se recomienda hacer un build nativo.
   */
  static async scheduleDailyReminder(hour: number, minute: number): Promise<boolean> {
    try {
      // Primero cancelar cualquier notificación existente
      await this.cancelDailyReminder();

      // Solicitar permisos si no los tenemos
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('⚠️ No se obtuvieron permisos para notificaciones');
        return false;
      }

      // Calcular la próxima fecha/hora para la notificación
      const now = new Date();
      const scheduledDate = new Date();
      scheduledDate.setHours(hour, minute, 0, 0);

      // Si la hora ya pasó hoy, programar para mañana
      if (scheduledDate <= now) {
        scheduledDate.setDate(scheduledDate.getDate() + 1);
      }

      const secondsUntilTrigger = Math.floor((scheduledDate.getTime() - now.getTime()) / 1000);

      console.log('📅 Programando notificación para:', scheduledDate.toLocaleString());
      console.log('⏱️  Tiempo hasta notificación:', Math.floor(secondsUntilTrigger / 60), 'minutos');

      // ENFOQUE HÍBRIDO: Intentar ambos métodos para mejor compatibilidad
      let notificationId: string;

      try {
        // Método 1: Usar segundos (más confiable en Expo Go)
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🧘 Momento de Meditar',
            body: 'Es hora de tu sesión diaria de meditación. ¡Toma unos minutos para ti!',
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 250, 250, 250],
            data: { 
              type: 'daily_reminder',
              scheduledTime: scheduledDate.toISOString()
            },
          },
          trigger: {
            seconds: secondsUntilTrigger,
            repeats: false, // Primera notificación sin repetición
          },
        });

        console.log('✅ Notificación programada usando trigger de segundos');
        
        // Programar también con CalendarTrigger para repetición (si funciona en el dispositivo)
        try {
          const recurringId = await Notifications.scheduleNotificationAsync({
            content: {
              title: '🧘 Momento de Meditar',
              body: 'Es hora de tu sesión diaria de meditación. ¡Toma unos minutos para ti!',
              sound: 'default',
              priority: Notifications.AndroidNotificationPriority.HIGH,
              vibrate: [0, 250, 250, 250],
              data: { type: 'daily_reminder_recurring' },
            },
            trigger: {
              hour: hour,
              minute: minute,
              repeats: true,
            } as any,
          });
          console.log('✅ Notificación recurrente también programada (ID:', recurringId, ')');
        } catch (recurringError) {
          console.log('⚠️ No se pudo programar notificación recurrente:', recurringError);
        }

      } catch (error) {
        console.error('❌ Error con trigger de segundos, intentando CalendarTrigger:', error);
        
        // Método 2: Fallback a CalendarTrigger
        notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: '🧘 Momento de Meditar',
            body: 'Es hora de tu sesión diaria de meditación. ¡Toma unos minutos para ti!',
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 250, 250, 250],
            data: { type: 'daily_reminder' },
          },
          trigger: {
            hour: hour,
            minute: minute,
            repeats: true,
          } as any,
        });
      }

      // Guardar la configuración
      await AsyncStorage.setItem(DAILY_REMINDER_KEY, notificationId);
      await AsyncStorage.setItem(
        DAILY_REMINDER_TIME_KEY,
        JSON.stringify({ hour, minute })
      );

      console.log('✅ Notificación diaria programada exitosamente:', { 
        notificationId, 
        hour, 
        minute,
        nextTrigger: scheduledDate.toLocaleString(),
        method: 'hybrid'
      });
      
      // Verificar notificaciones programadas
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Total de notificaciones programadas:', scheduled.length);
      
      return true;
    } catch (error) {
      console.error('❌ Error scheduling daily reminder:', error);
      return false;
    }
  }

  /**
   * Cancela el recordatorio diario
   */
  static async cancelDailyReminder(): Promise<void> {
    try {
      const notificationId = await AsyncStorage.getItem(DAILY_REMINDER_KEY);
      
      if (notificationId) {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        await AsyncStorage.removeItem(DAILY_REMINDER_KEY);
        await AsyncStorage.removeItem(DAILY_REMINDER_TIME_KEY);
        console.log('Notificación diaria cancelada');
      }
    } catch (error) {
      console.error('Error canceling daily reminder:', error);
    }
  }

  /**
   * Obtiene la hora configurada para el recordatorio diario
   */
  static async getDailyReminderTime(): Promise<{ hour: number; minute: number } | null> {
    try {
      const timeString = await AsyncStorage.getItem(DAILY_REMINDER_TIME_KEY);
      if (timeString) {
        return JSON.parse(timeString);
      }
      return null;
    } catch (error) {
      console.error('Error getting daily reminder time:', error);
      return null;
    }
  }

  /**
   * Verifica si el recordatorio diario está activo
   */
  static async isDailyReminderActive(): Promise<boolean> {
    try {
      const notificationId = await AsyncStorage.getItem(DAILY_REMINDER_KEY);
      if (!notificationId) {
        return false;
      }

      // Verificar si la notificación realmente existe
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      return scheduledNotifications.some(
        (notification) => notification.identifier === notificationId
      );
    } catch (error) {
      console.error('Error checking daily reminder status:', error);
      return false;
    }
  }

  /**
   * Envía una notificación de prueba inmediata
   */
  static async sendTestNotification(): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('No se obtuvieron permisos para notificaciones');
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧘 Notificación de Prueba',
          body: 'Las notificaciones están funcionando correctamente!',
          sound: 'default',
          data: { type: 'test' },
        },
        trigger: {
          seconds: 1,
        },
      });
      
      console.log('Notificación de prueba enviada (se mostrará en 1 segundo)');
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  }

  /**
   * Programa una notificación de prueba en X minutos (para testing)
   * Este método es más confiable en Expo Go usando segundos
   */
  static async scheduleTestNotificationInMinutes(minutes: number = 1): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('⚠️ No se obtuvieron permisos para notificaciones');
        return;
      }

      const seconds = minutes * 60;
      const testTime = new Date(Date.now() + seconds * 1000);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🧘 Recordatorio de Prueba',
          body: `Notificación programada para ${testTime.toLocaleTimeString()}. ¡Funciona!`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
          data: { 
            type: 'test_scheduled',
            scheduledFor: testTime.toISOString()
          },
        },
        trigger: {
          seconds: seconds,
        },
      });
      
      console.log(`✅ Notificación de prueba programada:`, {
        id: notificationId,
        time: testTime.toLocaleTimeString(),
        inSeconds: seconds
      });
      
      // Verificar que se programó correctamente
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 Notificaciones programadas:', scheduled.length);
      scheduled.forEach(n => {
        console.log('  -', n.identifier, ':', n.content.title);
      });
    } catch (error) {
      console.error('❌ Error scheduling test notification:', error);
    }
  }

  /**
   * Obtiene todas las notificaciones programadas (útil para debugging)
   */
  static async getScheduledNotifications(): Promise<void> {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      console.log('📋 === NOTIFICACIONES PROGRAMADAS ===');
      console.log('Total:', scheduled.length);
      scheduled.forEach((notification, index) => {
        console.log(`\n${index + 1}. ID:`, notification.identifier);
        console.log('   Título:', notification.content.title);
        console.log('   Trigger:', notification.trigger);
      });
      console.log('=================================\n');
      return scheduled as any;
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
    }
  }

  /**
   * Cancela todas las notificaciones programadas
   */
  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem(DAILY_REMINDER_KEY);
      await AsyncStorage.removeItem(DAILY_REMINDER_TIME_KEY);
      console.log('Todas las notificaciones canceladas');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}

