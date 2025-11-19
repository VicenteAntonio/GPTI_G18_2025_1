import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_REMINDER_ENABLED_KEY = '@meditation_email_reminder_enabled';
const EMAIL_REMINDER_TIME_KEY = '@meditation_email_reminder_time';

export class EmailService {
  /**
   * Configura un recordatorio por email
   * NOTA: Este servicio requiere un backend para enviar emails reales.
   * Por ahora, guarda la configuración localmente.
   */
  static async scheduleEmailReminder(hour: number, minute: number, userEmail: string): Promise<boolean> {
    try {
      // Guardar la configuración
      await AsyncStorage.setItem(EMAIL_REMINDER_ENABLED_KEY, 'true');
      await AsyncStorage.setItem(
        EMAIL_REMINDER_TIME_KEY,
        JSON.stringify({ hour, minute, email: userEmail })
      );

      console.log('📧 Recordatorio por email configurado:', { 
        hour, 
        minute, 
        email: userEmail,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      });

      // TODO: Aquí se debe llamar al backend para registrar el recordatorio
      // Ejemplo:
      // await fetch('https://tu-backend.com/api/email-reminders', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: userEmail, hour, minute })
      // });

      return true;
    } catch (error) {
      console.error('❌ Error scheduling email reminder:', error);
      return false;
    }
  }

  /**
   * Cancela el recordatorio por email
   */
  static async cancelEmailReminder(): Promise<void> {
    try {
      const config = await this.getEmailReminderTime();
      
      if (config) {
        await AsyncStorage.removeItem(EMAIL_REMINDER_ENABLED_KEY);
        await AsyncStorage.removeItem(EMAIL_REMINDER_TIME_KEY);
        
        console.log('📧 Recordatorio por email cancelado');

        // TODO: Llamar al backend para cancelar el recordatorio
        // await fetch('https://tu-backend.com/api/email-reminders', {
        //   method: 'DELETE',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: config.email })
        // });
      }
    } catch (error) {
      console.error('❌ Error canceling email reminder:', error);
    }
  }

  /**
   * Obtiene la hora configurada para el recordatorio por email
   */
  static async getEmailReminderTime(): Promise<{ hour: number; minute: number; email: string } | null> {
    try {
      const timeString = await AsyncStorage.getItem(EMAIL_REMINDER_TIME_KEY);
      if (timeString) {
        return JSON.parse(timeString);
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting email reminder time:', error);
      return null;
    }
  }

  /**
   * Verifica si el recordatorio por email está activo
   */
  static async isEmailReminderActive(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(EMAIL_REMINDER_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('❌ Error checking email reminder status:', error);
      return false;
    }
  }

  /**
   * Envía un email de prueba (simulado)
   */
  static async sendTestEmail(userEmail: string): Promise<boolean> {
    try {
      console.log('📧 Enviando email de prueba a:', userEmail);
      
      // TODO: Implementar envío real con backend
      // await fetch('https://tu-backend.com/api/email-reminders/test', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: userEmail })
      // });

      // Por ahora solo simulamos el envío
      console.log('✅ Email de prueba enviado (simulado)');
      return true;
    } catch (error) {
      console.error('❌ Error sending test email:', error);
      return false;
    }
  }

  /**
   * Valida formato de email
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

