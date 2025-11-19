# 🗄️ Gestión de Base de Datos

Guía completa para gestionar la base de datos de la aplicación de meditación.

## 📊 Estructura de la Base de Datos

La aplicación usa **AsyncStorage** de React Native para almacenar datos localmente:

### Claves de Almacenamiento

| Clave | Contenido | Descripción |
|-------|-----------|-------------|
| `@users` | Array de User | Todos los usuarios registrados |
| `@lessons` | Array de Lesson | Lecciones guardadas |
| `@current_user` | string (email) | Usuario actualmente logueado |
| `@user_progress` | Legacy | Sistema antiguo de progreso |
| `@completed_sessions` | Legacy | Sistema antiguo de sesiones |

## 🛠️ Métodos de Limpieza

### 1. Limpiar Todos los Usuarios

Elimina todos los usuarios pero mantiene las lecciones.

```typescript
import { DatabaseService } from './src/services/DatabaseService';

// Eliminar todos los usuarios
await DatabaseService.clearAllUsers();
```

### 2. Limpiar Toda la Base de Datos

Elimina **TODO**: usuarios, lecciones, sesiones, progreso.

```typescript
// ⚠️ PRECAUCIÓN: No se puede deshacer
await DatabaseService.clearAllData();
```

### 3. Obtener Estadísticas

Ver información sobre la base de datos actual.

```typescript
const stats = await DatabaseService.getDatabaseStats();
console.log(stats);
// {
//   totalUsers: 3,
//   totalLessons: 0,
//   currentUser: 'usuario@example.com'
// }
```

## 📱 Pantalla de DevTools

La aplicación incluye una pantalla de herramientas de desarrollo para gestionar la base de datos visualmente.

### Agregar DevTools a la Navegación

Edita `src/navigation/AppNavigator.tsx`:

```typescript
import DevToolsScreen from '../screens/DevToolsScreen';

// En el Stack Navigator
<Stack.Screen 
  name="DevTools" 
  component={DevToolsScreen}
  options={{ title: 'Dev Tools' }}
/>
```

### Agregar Botón de Acceso

En `ProfileScreen.tsx`, agrega un botón para acceder a DevTools:

```typescript
// Solo en desarrollo
{__DEV__ && (
  <Button
    title="🛠️ Dev Tools"
    onPress={() => navigation.navigate('DevTools')}
  />
)}
```

### Características de DevTools

La pantalla de DevTools permite:

1. **Ver Estadísticas**
   - Total de usuarios
   - Total de lecciones
   - Usuario actual logueado

2. **Listar Usuarios**
   - Ver todos los usuarios registrados
   - Ver estadísticas de cada usuario

3. **Eliminar Usuarios**
   - Eliminar todos los usuarios
   - Confirmación de seguridad

4. **Limpiar Base de Datos**
   - Resetear completamente la BD
   - Confirmación doble de seguridad

## 🔧 Limpieza Manual en Dispositivos

### iOS Simulator

```bash
# Resetear el simulador completo
xcrun simctl erase all

# O borrar datos de la app específica
# Settings → General → iPhone Storage → [App Name] → Delete App
```

### Android Emulator

```bash
# Limpiar datos de la app
adb shell pm clear com.tuapp

# O desde el emulador:
# Settings → Apps → [App Name] → Storage → Clear Data
```

### Dispositivo Real

#### iOS
1. Abrir Ajustes
2. General → Almacenamiento del iPhone
3. Buscar la app
4. Eliminar app (con datos)
5. Reinstalar desde Expo Go

#### Android
1. Abrir Ajustes
2. Aplicaciones → [Nombre de la app]
3. Almacenamiento → Borrar datos
4. O desinstalar y reinstalar

## 💻 Desde el Código

### En Cualquier Componente

```typescript
import { Alert } from 'react-native';
import { DatabaseService } from '../services/DatabaseService';

const handleClearDB = async () => {
  Alert.alert(
    'Confirmar',
    '¿Limpiar todos los usuarios?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí',
        style: 'destructive',
        onPress: async () => {
          try {
            await DatabaseService.clearAllUsers();
            Alert.alert('Éxito', 'Usuarios eliminados');
          } catch (error) {
            Alert.alert('Error', 'No se pudo limpiar');
          }
        }
      }
    ]
  );
};
```

### En la Consola de React Native

Cuando la app está corriendo, puedes usar:

```javascript
// En Chrome DevTools o React Native Debugger
import { DatabaseService } from './src/services/DatabaseService';

// Ver usuarios
DatabaseService.getAllUsers().then(console.log);

// Ver estadísticas
DatabaseService.getDatabaseStats().then(console.log);

// Limpiar usuarios
DatabaseService.clearAllUsers();

// Limpiar todo
DatabaseService.clearAllData();
```

## 🚨 Casos de Uso Comunes

### Desarrollo: Empezar desde Cero

```typescript
// 1. Limpiar todo
await DatabaseService.clearAllData();

// 2. Crear nuevo usuario de prueba
await AuthService.register(
  'test',
  'test@example.com',
  'password123'
);
```

### Testing: Resetear Entre Pruebas

```typescript
beforeEach(async () => {
  await DatabaseService.clearAllData();
});

afterEach(async () => {
  await DatabaseService.clearAllData();
});
```

### Producción: Logout Completo

```typescript
const handleLogout = async () => {
  // Solo cerrar sesión actual, no eliminar usuarios
  await AuthService.logout();
  navigation.navigate('Login');
};
```

## 📋 Checklist de Limpieza

Antes de hacer una limpieza completa, verifica:

- [ ] ¿Guardaste los datos importantes?
- [ ] ¿Es solo para desarrollo?
- [ ] ¿Confirmaste con el usuario?
- [ ] ¿Tienes un backup si es producción?

## ⚠️ Advertencias Importantes

### 🚫 NO Hacer en Producción

```typescript
// ❌ MAL: Limpiar en producción sin confirmación
await DatabaseService.clearAllData();

// ✅ BIEN: Solo en desarrollo o con confirmación
if (__DEV__) {
  await DatabaseService.clearAllData();
}
```

### 🔒 Proteger DevTools

```typescript
// Solo mostrar en desarrollo
{__DEV__ && (
  <TouchableOpacity onPress={() => navigation.navigate('DevTools')}>
    <Text>Dev Tools</Text>
  </TouchableOpacity>
)}
```

### 💾 Backup Antes de Limpiar

```typescript
const backupUsers = async () => {
  const users = await DatabaseService.getAllUsers();
  console.log('Backup:', JSON.stringify(users, null, 2));
  // Copiar y guardar en archivo
};
```

## 🐛 Troubleshooting

### "Cannot read property..." después de limpiar

La sesión sigue activa pero el usuario fue eliminado. Solución:

```typescript
// Limpiar Y hacer logout
await DatabaseService.clearAllUsers();
await AuthService.logout();
navigation.reset({
  index: 0,
  routes: [{ name: 'Login' }],
});
```

### Los datos persisten

AsyncStorage podría estar en caché:

```typescript
// Forzar recarga
await AsyncStorage.clear(); // Limpia TODO
```

### Error de permisos

En algunos dispositivos AsyncStorage necesita permisos:

```typescript
try {
  await DatabaseService.clearAllUsers();
} catch (error) {
  console.error('Error:', error);
  Alert.alert('Error', 'No se pudo acceder al almacenamiento');
}
```

## 📖 Referencias

- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [React Navigation - Reset](https://reactnavigation.org/docs/navigation-actions/#reset)
- [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) (alternativa segura)

## 🔗 Archivos Relacionados

- `src/services/DatabaseService.ts` - Métodos de limpieza
- `src/services/AuthService.ts` - Gestión de sesiones
- `src/screens/DevToolsScreen.tsx` - Interfaz visual
- `docs/BASE_DE_DATOS.md` - Esquema completo de BD

