# Instrucciones de Ejecución

## 📋 Requisitos Previos

### Software Necesario

1. **Node.js** (versión 20.x o superior)
   ```bash
   node --version  # Debe mostrar v20.x.x o superior
   ```

2. **npm** (viene con Node.js)
   ```bash
   npm --version
   ```

3. **Expo Go** en tu dispositivo móvil
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Verificación del Sistema

```bash
# Verificar versiones
node --version
npm --version

# Limpiar caché de npm si es necesario
npm cache clean --force
```

## 🚀 Instalación

### Opción 1: Instalación Manual

```bash
# 1. Clonar el repositorio (si aún no lo has hecho)
git clone <repository-url>
cd GPTI_G18_2025_1

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Iniciar el servidor
npm start
```

### Opción 2: Script de Limpieza Completa

Si tienes problemas o quieres una instalación limpia:

```bash
# Ejecutar script de limpieza e inicio
./scripts/clean_start.sh
```

Este script hace:
1. Limpia `node_modules`, `package-lock.json`, `.expo`, `android`, `ios`
2. Reinstala todas las dependencias
3. Inicia el servidor con tunnel y cache limpio

## 📱 Ejecución en Expo Go

### Paso 1: Iniciar el Servidor

```bash
npm start
```

Verás una salida similar a:
```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

### Paso 2: Conectar con Expo Go

#### En Android:
1. Abre la app **Expo Go**
2. Toca **"Scan QR Code"**
3. Escanea el código QR que aparece en la terminal

#### En iOS:
1. Abre la app **Cámara**
2. Apunta al código QR
3. Toca la notificación que aparece
4. Se abrirá en Expo Go automáticamente

### Paso 3: Esperar la Compilación

La primera vez tomará unos minutos para:
- Descargar las dependencias de JavaScript
- Compilar el bundle
- Cargar la aplicación

## 🔧 Comandos Disponibles

```bash
# Iniciar servidor (modo normal)
npm start

# Iniciar con LAN (recomendado para móvil en misma red)
npm run start:lan

# Iniciar con tunnel (si LAN no funciona)
npm run start:tunnel

# Limpiar e iniciar desde cero
./scripts/clean_start.sh
```

## 🌐 Modos de Conexión

### 1. LAN (Recomendado)
```bash
npm run start:lan
```

**Ventajas:**
- ✅ Más rápido
- ✅ Más estable
- ✅ No requiere internet

**Requisitos:**
- Computadora y móvil en la misma red WiFi
- Sin firewall bloqueando

### 2. Tunnel
```bash
npm run start:tunnel
```

**Ventajas:**
- ✅ Funciona desde cualquier red
- ✅ No requiere misma WiFi

**Desventajas:**
- ⚠️ Más lento
- ⚠️ Requiere internet
- ⚠️ Puede dar errores de timeout

### 3. Localhost (Solo para web)
```bash
npm start
# Presiona 'w' en la terminal
```

## 🐛 Solución de Problemas

### Error: "Metro Bundler took too long"

**Solución:**
```bash
# Limpiar todo e intentar de nuevo
rm -rf node_modules package-lock.json .expo
npm install --legacy-peer-deps
npm start -- --clear
```

### Error: "Unable to resolve module"

**Solución:**
```bash
# Reiniciar el bundler con caché limpio
npm start -- --clear --reset-cache
```

### Error: "TypeError: fetch failed"

Este error es **no crítico** y no afecta la ejecución. Se debe a que Expo intenta verificar versiones en línea.

**Opciones:**
1. Ignorarlo (la app funciona igual)
2. Verificar conexión a internet
3. Usar modo LAN en lugar de tunnel

### Error: "Could not connect to development server"

**Soluciones:**
1. Verificar que computadora y móvil estén en la misma red WiFi
2. Desactivar VPN si está activa
3. Verificar que el firewall no bloquee el puerto 8081
4. Intentar con modo tunnel: `npm run start:tunnel`

### Error: "Network response timed out"

**Solución:**
```bash
# Usar LAN en lugar de tunnel
npm run start:lan
```

### App se queda en "Loading..."

**Soluciones:**
1. Cerrar Expo Go completamente y volver a abrir
2. Limpiar caché: `npm start -- --clear`
3. Reinstalar dependencias:
   ```bash
   rm -rf node_modules
   npm install --legacy-peer-deps
   ```

### Problemas con Versiones de Node

Si tienes Node.js antiguo (< v18):

```bash
# Usar nvm para actualizar (recomendado)
nvm install 20
nvm use 20
```

O descargar Node.js 20 desde [nodejs.org](https://nodejs.org/)

## 🔄 Actualización de Dependencias

Si necesitas actualizar las dependencias:

```bash
# Ver qué paquetes necesitan actualización
npx expo-cli doctor

# Actualizar a las versiones compatibles con SDK 54
npx expo install --fix
```

## 📊 Monitoreo y Debugging

### Ver logs en tiempo real

```bash
# La terminal muestra automáticamente los logs
npm start

# Logs específicos de la app aparecerán aquí
```

### Abrir DevTools

Cuando la app está corriendo:
- Presiona `d` en la terminal para abrir Dev Menu
- Presiona `j` para abrir Chrome DevTools

### Recargar la App

- **Android**: Agita el dispositivo y toca "Reload"
- **iOS**: Agita el dispositivo y toca "Reload"
- O presiona `r` en la terminal

## 🧪 Modo de Prueba

Para probar rápidamente el sistema de puntos:

1. Registra un nuevo usuario o inicia sesión
2. Ve a "Home"
3. Busca la sesión **"Sueño Rápido"** (7 segundos)
4. Completa la sesión
5. Verifica en "Perfil" que se agregó:
   - +1 Betterflie
   - +1 Racha
   - +1 Sesión de Sueño

## 📱 Credenciales de Prueba

### Usuario Demo (si existe)
```
Email: demo@meditacion.app
Password: demo123
```

### Crear Usuario Nuevo
1. Abrir app
2. Presionar "Crear Cuenta"
3. Llenar formulario:
   - Nombre de usuario
   - Email válido
   - Contraseña (mínimo 6 caracteres)
   - Confirmar contraseña

## 🎯 Flujo de Uso Completo

### Primera Vez

1. **Abrir la App**
   - Verás el splash screen con logo
   - Después aparece la pantalla de login

2. **Registrarse**
   - Toca "Crear Cuenta"
   - Llena todos los campos
   - Toca "Registrarse"
   - Se creará tu cuenta y entrarás automáticamente

3. **Explorar**
   - **Home**: Ver sesiones disponibles
   - **Perfil**: Ver tu progreso
   - Estadísticas iniciales en 0

4. **Primera Meditación**
   - Toca "Sueño Rápido" (7 seg para prueba)
   - El timer iniciará automáticamente
   - Puedes pausar con el botón 🟢/🔴
   - Al terminar verás un resumen con betterflies ganadas

5. **Verificar Progreso**
   - Ve a **Perfil**
   - Verás:
     - Betterflies ganadas
     - Racha actual
     - Tipo de sesión favorito
     - Desglose por categoría

### Uso Diario

1. **Abrir App**
   - Login automático si ya iniciaste sesión
   - Si han pasado 2+ días, tu racha se resetea

2. **Completar Sesión**
   - Elige una categoría
   - Completa la meditación
   - Gana betterflies y mantén tu racha

3. **Cerrar Sesión (Opcional)**
   - Ve a **Perfil**
   - Toca **"🚪 Cerrar Sesión"**
   - Confirma

## 🔐 Datos Locales

**Importante:** Todos los datos se guardan localmente en tu dispositivo:

- ✅ No requiere internet después de descargar
- ✅ Tus datos son privados
- ⚠️ Si desinstalas la app, pierdes los datos
- ⚠️ Los datos no se sincronizan entre dispositivos

### Limpiar Datos

Para borrar todos los datos guardados:

```javascript
// Desde el código (para desarrollo)
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

O simplemente desinstalar y reinstalar la app.

## 📚 Estructura de Navegación

```
App
├── SplashScreen (animación inicial)
├── LoginScreen (si no hay sesión)
├── RegisterScreen (crear cuenta)
└── MainTabs (si hay sesión)
    ├── Home (🏠)
    │   └── MeditationScreen (al tocar sesión)
    └── Profile (👤)
```

## 🎨 Temas y Personalización

### Colores de Categorías
- **Sueño**: Turquesa (#4ECDC4) 😴
- **Relajación**: Rojo suave (#FF6B6B) 🧘
- **Autoconciencia**: Verde suave (#96CEB4) 🌸

### Betterflies
- Icono: `Betterflie.png`
- Color de fondo: Amarillo claro (#FFF9E6)
- Borde: Dorado (#FFD700)

## 💡 Tips de Desarrollo

### Hot Reload
La app se recarga automáticamente al guardar cambios en el código.

### Fast Refresh
React Native Fast Refresh está habilitado por defecto.

### Ver Cambios Inmediatamente
1. Guarda el archivo
2. La app se actualiza automáticamente
3. Si no funciona, presiona `r` en la terminal

### Depurar Errores
- Los errores aparecen en pantalla roja
- Toca "Dismiss" para cerrar
- Revisa la terminal para detalles

## 🚀 Próximos Pasos

Una vez que la app funciona:

1. **Probar todas las funciones**
   - Login/Register
   - Completar sesiones
   - Ver estadísticas
   - Cerrar sesión

2. **Probar el sistema de racha**
   - Completa sesión hoy
   - Completa otra mañana (racha +1)
   - Completa varias en un día (racha se mantiene)

3. **Verificar categoría favorita**
   - Completa varias de un tipo
   - Ve al perfil
   - Verifica que muestra la correcta

## 📞 Soporte

Si tienes problemas:

1. Revisa esta documentación
2. Consulta el `README.md`
3. Revisa los logs en la terminal
4. Intenta limpiar caché: `npm start -- --clear`
5. Como último recurso: `./scripts/clean_start.sh`

## 🔗 Enlaces Útiles

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [Expo Go Download](https://expo.dev/client)

