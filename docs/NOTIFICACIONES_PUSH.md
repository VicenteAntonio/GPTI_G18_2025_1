# 🔔 Notificaciones Push - Guía Completa

## 📋 Tabla de Contenidos
1. [Limitaciones en Expo Go](#limitaciones-en-expo-go)
2. [Mejoras Implementadas](#mejoras-implementadas)
3. [Cómo Probar en Expo Go](#cómo-probar-en-expo-go)
4. [Build Nativo para Producción](#build-nativo-para-producción)
5. [Troubleshooting](#troubleshooting)

---

## ⚠️ Limitaciones en Expo Go

### ¿Por qué las notificaciones NO funcionan completamente en Expo Go?

#### 1. **Restricciones de la Plataforma**
```
Expo Go es una app de desarrollo, NO una app de producción.
```

**Limitaciones técnicas:**
- ❌ **CalendarTrigger recurrente**: No funciona de forma confiable
- ❌ **Notificaciones en segundo plano**: Limitadas o bloqueadas
- ❌ **Gestión de energía**: El sistema puede matar Expo Go
- ❌ **Permisos completos**: No tiene todos los permisos nativos

#### 2. **Diferencias Expo Go vs Build Nativo**

| Característica | Expo Go | Build Nativo |
|---------------|---------|--------------|
| Notificaciones inmediatas | ✅ Funciona | ✅ Funciona |
| Notificaciones programadas (<1 hora) | ⚠️ Parcial | ✅ Funciona |
| Notificaciones recurrentes diarias | ❌ No confiable | ✅ Funciona |
| Background execution | ❌ Limitado | ✅ Completo |
| Permisos del sistema | ⚠️ Limitados | ✅ Completos |

#### 3. **Comportamiento del Sistema Operativo**

**Android:**
- Mata apps en segundo plano para ahorrar batería
- Expo Go no tiene prioridad del sistema
- Las notificaciones se pierden al cerrar la app

**iOS:**
- Más restrictivo con apps en desarrollo
- Background refresh limitado
- Notificaciones pueden no dispararse

---

## ✅ Mejoras Implementadas

### 1. **Enfoque Híbrido de Triggers**

```typescript
// Método 1: Trigger por segundos (más confiable en Expo Go)
trigger: {
  seconds: secondsUntilTrigger,
  repeats: false
}

// Método 2: CalendarTrigger como fallback (para builds nativos)
trigger: {
  hour: 14,
  minute: 30,
  repeats: true
}
```

**Ventajas:**
- ✅ Mejor compatibilidad con Expo Go
- ✅ Funciona en ambos entornos
- ✅ Logging detallado para debugging

### 2. **Sistema de Logging Mejorado**

```typescript
console.log('📅 Programando notificación para:', date);
console.log('⏱️  Tiempo hasta notificación:', minutes, 'minutos');
console.log('✅ Notificación programada exitosamente');
```

**Ver logs en la consola:**
```bash
npx expo start
# Los logs aparecerán en la terminal
```

### 3. **Función de Prueba Mejorada**

Ahora puedes probar notificaciones en:
- 5 segundos (prueba rápida)
- 30 segundos (prueba media)
- 1 minuto (prueba completa)

---

## 🧪 Cómo Probar en Expo Go

### Paso 1: Verificar Permisos

```bash
# Android: Ve a Settings > Apps > Expo Go > Permissions > Notifications
# iOS: Settings > Expo Go > Notifications
```

**Asegúrate de:**
- ✅ Notificaciones permitidas
- ✅ Sonido activado
- ✅ Sin modo "No molestar"

### Paso 2: Probar Notificación Inmediata

1. Abre la app en Expo Go
2. Ve a **Perfil → Configuración**
3. Activa **Notificaciones**
4. Toca **"🔔 Probar Notificación"**
5. Selecciona **"5 segundos"**
6. **¡IMPORTANTE! Mantén la app abierta**
7. Espera 5 segundos

**Resultado esperado:**
- ✅ Notificación aparece en 5 segundos
- ✅ Con sonido y vibración
- ✅ Título: "🧘 Recordatorio de Prueba"

### Paso 3: Probar en Segundo Plano

1. Repite el Paso 2 pero selecciona **"1 minuto"**
2. **Minimiza la app** (no la cierres)
3. Espera 1 minuto

**En Expo Go:**
- ⚠️ Puede funcionar o no (limitación conocida)
- ✅ Si funciona, es buena señal

### Paso 4: Probar Recordatorio Diario

1. Ve a **Configuración → Recordatorio Diario**
2. Selecciona una hora **2-3 minutos** en el futuro
3. Confirma la hora
4. **Mantén la app abierta** durante esos minutos

**Resultado esperado en Expo Go:**
- ⚠️ Puede NO funcionar (limitación de Expo Go)
- ✅ Funcionará en build nativo

---

## 🏗️ Build Nativo para Producción

### ¿Cuándo hacer un Build Nativo?

**Necesitas un build nativo SI:**
- 🎯 Quieres notificaciones recurrentes confiables
- 🎯 La app debe funcionar en segundo plano
- 🎯 Vas a publicar en tiendas (Google Play / App Store)
- 🎯 Necesitas testing completo de producción

### Opción 1: EAS Build (Recomendado)

#### Instalar EAS CLI
```bash
npm install -g eas-cli
eas login
```

#### Configurar el Proyecto
```bash
cd /home/vicente/UC/GPTI/GPTI_G18_2025_1
eas build:configure
```

#### Build para Android (APK para testing)
```bash
# Development build (para testing)
eas build --platform android --profile preview

# Production build (para publicar)
eas build --platform android --profile production
```

#### Build para iOS
```bash
# Necesitas cuenta de Apple Developer ($99/año)
eas build --platform ios --profile production
```

**Tiempo estimado:** 10-20 minutos por build

### Opción 2: Build Local

#### Android
```bash
# Instalar Android Studio primero
npx expo run:android --variant release
```

#### iOS (solo en Mac)
```bash
npx expo run:ios --configuration Release
```

---

## 🔧 Troubleshooting

### Problema 1: No llegan notificaciones en Expo Go

**Solución:**
1. ✅ Verifica permisos de notificaciones
2. ✅ Prueba con 5 segundos primero (app abierta)
3. ✅ Revisa los logs en la consola
4. ⚠️ **Limitación conocida de Expo Go** - considera build nativo

### Problema 2: "No se obtuvieron permisos"

**Android:**
```bash
# Desinstala y reinstala Expo Go
# Ve a Settings > Apps > Expo Go > Permissions
# Activa TODAS las notificaciones
```

**iOS:**
```bash
# Settings > Expo Go > Notifications > Allow Notifications
```

### Problema 3: Notificaciones se pierden al cerrar app

**Causa:** Expo Go no tiene prioridad de sistema

**Solución:**
- En Expo Go: Minimiza, no cierres la app
- Para producción: Usa build nativo

### Problema 4: No funciona en segundo plano

**Expo Go:** Limitación conocida ❌

**Solución:** Build nativo ✅

---

## 📊 Verificar Estado de Notificaciones

### En la Consola de Desarrollo

```javascript
// El NotificationService imprime automáticamente:
// ✅ Notificación programada exitosamente
// 📋 Total de notificaciones programadas: X
// ⏱️  Tiempo hasta notificación: X minutos
```

### Manualmente en Código

```typescript
import { NotificationService } from './src/services/NotificationService';

// Ver todas las notificaciones programadas
await NotificationService.getScheduledNotifications();
```

---

## 🎯 Recomendaciones Finales

### Para Desarrollo (Expo Go)
1. ✅ Usa notificaciones de prueba cortas (5-30 segundos)
2. ✅ Mantén la app abierta/minimizada
3. ✅ Revisa los logs constantemente
4. ⚠️ No dependas de notificaciones recurrentes

### Para Producción (Build Nativo)
1. ✅ Haz un build con EAS
2. ✅ Prueba en dispositivos reales
3. ✅ Las notificaciones recurrentes funcionarán correctamente
4. ✅ Permisos y background execution completos

### Testing Sugerido
```
1. Prueba en Expo Go:
   - Notificaciones inmediatas ✅
   - Notificaciones cortas (30s-1min) ⚠️

2. Prueba con Build Nativo:
   - Todas las notificaciones ✅
   - Recordatorios diarios ✅
   - Background execution ✅
```

---

## 📚 Recursos Adicionales

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [Push Notifications Limitations](https://docs.expo.dev/push-notifications/overview/)

---

## ✨ Conclusión

**En Resumen:**

| Entorno | Notificaciones Inmediatas | Notificaciones Programadas | Notificaciones Recurrentes |
|---------|---------------------------|----------------------------|---------------------------|
| **Expo Go** | ✅ Funciona | ⚠️ Parcial | ❌ No confiable |
| **Build Nativo** | ✅ Funciona | ✅ Funciona | ✅ Funciona |

**Para una experiencia completa de notificaciones, se requiere un build nativo.**

---

*Documentación actualizada: 2025-11-19*




