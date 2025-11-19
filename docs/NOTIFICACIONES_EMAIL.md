# 📧 Notificaciones por Email - Guía de Implementación

## 📋 Descripción General

El sistema de notificaciones por email permite a los usuarios recibir recordatorios diarios de meditación directamente en su correo electrónico. Esta funcionalidad utiliza un servicio frontend que **requiere un backend** para enviar emails reales.

## 🏗️ Arquitectura Actual

### Estado Actual (Frontend Only)
El sistema actualmente está implementado solo en el **frontend** y:
- ✅ Guarda la configuración localmente (AsyncStorage)
- ✅ Valida el formato del email
- ✅ Muestra la hora configurada en la UI
- ❌ **NO envía emails reales** (requiere backend)

### Componentes Implementados

#### 1. `EmailService.ts`
Servicio que maneja toda la lógica de notificaciones por email:

```typescript
// Configurar recordatorio
await EmailService.scheduleEmailReminder(hour, minute, userEmail);

// Cancelar recordatorio
await EmailService.cancelEmailReminder();

// Obtener configuración
const config = await EmailService.getEmailReminderTime();

// Verificar si está activo
const isActive = await EmailService.isEmailReminderActive();

// Validar email
const isValid = EmailService.validateEmail(email);
```

#### 2. `SettingsScreen.tsx`
Pantalla de configuración con:
- Switch para activar/desactivar recordatorios por email
- Modal con selector de hora (igual al de notificaciones push)
- Muestra el email del usuario y la hora configurada
- Validación de email antes de activar

## 🚀 Cómo Implementar el Backend

Para que los emails funcionen realmente, necesitas implementar un backend. Aquí hay tres opciones:

### Opción 1: Backend con Node.js + Nodemailer

**1. Crear un servidor Express:**

```javascript
// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const app = express();

app.use(express.json());

// Configurar nodemailer con tu proveedor de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Almacenamiento temporal (usa una base de datos real en producción)
const emailReminders = new Map();

// Endpoint para registrar recordatorio
app.post('/api/email-reminders', async (req, res) => {
  const { email, hour, minute } = req.body;
  
  // Guardar en la base de datos
  emailReminders.set(email, { hour, minute, active: true });
  
  res.json({ success: true, message: 'Recordatorio configurado' });
});

// Endpoint para cancelar recordatorio
app.delete('/api/email-reminders', async (req, res) => {
  const { email } = req.body;
  emailReminders.delete(email);
  res.json({ success: true, message: 'Recordatorio cancelado' });
});

// Función para enviar email
async function sendReminderEmail(email) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: '🧘 Momento de Meditar',
    html: `
      <h2>Es hora de tu sesión diaria de meditación</h2>
      <p>Toma unos minutos para ti y encuentra la paz interior.</p>
      <a href="tu-app://meditation">Comenzar Meditación</a>
    `
  };
  
  await transporter.sendMail(mailOptions);
}

// Cron job que se ejecuta cada minuto
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Verificar qué usuarios deben recibir email ahora
  for (const [email, config] of emailReminders.entries()) {
    if (config.active && config.hour === currentHour && config.minute === currentMinute) {
      try {
        await sendReminderEmail(email);
        console.log(`✅ Email enviado a ${email}`);
      } catch (error) {
        console.error(`❌ Error enviando email a ${email}:`, error);
      }
    }
  }
});

app.listen(3000, () => {
  console.log('🚀 Servidor de emails corriendo en puerto 3000');
});
```

**2. Actualizar `EmailService.ts`:**

```typescript
static async scheduleEmailReminder(hour: number, minute: number, userEmail: string): Promise<boolean> {
  try {
    await AsyncStorage.setItem(EMAIL_REMINDER_ENABLED_KEY, 'true');
    await AsyncStorage.setItem(
      EMAIL_REMINDER_TIME_KEY,
      JSON.stringify({ hour, minute, email: userEmail })
    );

    // Llamar al backend
    const response = await fetch('https://tu-backend.com/api/email-reminders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await AuthService.getToken()}` // Si usas auth
      },
      body: JSON.stringify({ email: userEmail, hour, minute })
    });

    if (!response.ok) {
      throw new Error('Error al configurar recordatorio en el servidor');
    }

    return true;
  } catch (error) {
    console.error('❌ Error scheduling email reminder:', error);
    return false;
  }
}
```

### Opción 2: Firebase Cloud Functions

**1. Crear función en Firebase:**

```javascript
// functions/index.js
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

admin.initializeApp();

// Configurar transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.password
  }
});

// Función programada que se ejecuta cada minuto
exports.sendEmailReminders = functions.pubsub
  .schedule('* * * * *')
  .onRun(async (context) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Buscar usuarios con recordatorios activos
    const snapshot = await admin.firestore()
      .collection('emailReminders')
      .where('active', '==', true)
      .where('hour', '==', currentHour)
      .where('minute', '==', currentMinute)
      .get();
    
    const promises = snapshot.docs.map(async (doc) => {
      const { email } = doc.data();
      
      await transporter.sendMail({
        from: functions.config().email.user,
        to: email,
        subject: '🧘 Momento de Meditar',
        html: `
          <h2>Es hora de tu sesión diaria de meditación</h2>
          <p>Toma unos minutos para ti.</p>
        `
      });
    });
    
    await Promise.all(promises);
    return null;
  });

// HTTP endpoint para registrar recordatorio
exports.scheduleEmailReminder = functions.https.onCall(async (data, context) => {
  const { email, hour, minute } = data;
  
  await admin.firestore().collection('emailReminders').doc(email).set({
    email,
    hour,
    minute,
    active: true,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  return { success: true };
});
```

### Opción 3: Servicios de Email Marketing

Usar servicios como:
- **SendGrid** (API simple, gratis hasta 100 emails/día)
- **Mailgun** (API potente)
- **AWS SES** (muy económico)
- **Resend** (moderna y fácil de usar)

Ejemplo con SendGrid:

```typescript
// EmailService.ts
static async scheduleEmailReminder(hour: number, minute: number, userEmail: string): Promise<boolean> {
  try {
    // Guardar localmente
    await AsyncStorage.setItem(EMAIL_REMINDER_ENABLED_KEY, 'true');
    await AsyncStorage.setItem(
      EMAIL_REMINDER_TIME_KEY,
      JSON.stringify({ hour, minute, email: userEmail })
    );

    // Llamar a tu backend que usa SendGrid
    const response = await fetch('https://tu-backend.com/api/sendgrid/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: userEmail, 
        hour, 
        minute,
        templateId: 'meditation-reminder' // Template de SendGrid
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}
```

## 📝 Variables de Entorno Necesarias

Para cualquier backend, necesitarás:

```env
# Para nodemailer con Gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-app-password  # No usar contraseña real, crear App Password

# Para SendGrid
SENDGRID_API_KEY=tu-api-key

# Para Mailgun
MAILGUN_API_KEY=tu-api-key
MAILGUN_DOMAIN=tu-dominio.mailgun.org

# Para AWS SES
AWS_ACCESS_KEY_ID=tu-access-key
AWS_SECRET_ACCESS_KEY=tu-secret-key
AWS_REGION=us-east-1
```

## 🔒 Seguridad

**⚠️ IMPORTANTE:**
1. **NUNCA** pongas credenciales en el código frontend
2. **SIEMPRE** usa variables de entorno en el backend
3. Implementa autenticación para los endpoints
4. Valida y sanitiza todos los inputs
5. Usa rate limiting para prevenir abuso

## 🧪 Testing

### Probar sin Backend
El sistema actual permite probar la UI y la experiencia de usuario sin backend:
1. Activa el recordatorio por email
2. Selecciona una hora
3. La configuración se guarda localmente
4. La UI muestra la hora configurada

### Probar con Backend
Una vez implementado el backend:
1. Configura el recordatorio
2. Espera a la hora programada
3. Verifica que llegue el email
4. Comprueba los logs del servidor

## 🐛 Troubleshooting

### Los emails no se envían
- ✅ Verifica que el backend esté corriendo
- ✅ Comprueba las credenciales de email
- ✅ Revisa los logs del servidor
- ✅ Verifica que el cron job esté funcionando

### Gmail bloquea los envíos
- Usa "App Passwords" en lugar de tu contraseña real
- Habilita "Less secure app access" (no recomendado)
- Mejor opción: Usa SendGrid o similar

### El email llega a spam
- Configura SPF, DKIM y DMARC records
- Usa un servicio profesional (SendGrid, Mailgun)
- Verifica el contenido del email

## 📚 Recursos

- [Nodemailer Documentation](https://nodemailer.com/)
- [SendGrid API](https://docs.sendgrid.com/)
- [Firebase Cloud Functions](https://firebase.google.com/docs/functions)
- [Node-cron](https://www.npmjs.com/package/node-cron)

## ✅ Próximos Pasos

1. **Elegir proveedor de email** (SendGrid recomendado para empezar)
2. **Crear backend** (Node.js + Express o Firebase Functions)
3. **Implementar endpoints**
4. **Configurar cron jobs**
5. **Actualizar `EmailService.ts`** con las URLs reales
6. **Testing completo**
7. **Deploy del backend**

---

💡 **Tip:** Para desarrollo, puedes usar [MailHog](https://github.com/mailhog/MailHog) o [Mailtrap](https://mailtrap.io/) para capturar y visualizar emails sin enviarlos realmente.

