# 🚀 Guía Rápida de Configuración y Desarrollo

## Para Desarrollo Rápido

### 1. Iniciar la App

```bash
npm start
```

### 2. Limpiar Base de Datos Durante Desarrollo

Tienes 3 opciones:

#### Opción A: Usando DevTools (Recomendado) 🛠️

1. Agrega esta línea en `src/screens/ProfileScreen.tsx` (dentro del componente):

```typescript
// Importar al inicio
import { useNavigation } from '@react-navigation/native';

// Dentro del return, agregar este botón (solo visible en desarrollo):
{__DEV__ && (
  <Button
    title="🛠️ Dev Tools"
    onPress={() => navigation.navigate('DevTools' as any)}
  />
)}
```

2. Agrega la pantalla en `src/navigation/AppNavigator.tsx`:

```typescript
import DevToolsScreen from '../screens/DevToolsScreen';

// Dentro del Stack.Navigator:
<Stack.Screen 
  name="DevTools" 
  component={DevToolsScreen}
  options={{ title: 'Herramientas de Desarrollo' }}
/>
```

3. Usa la interfaz visual para:
   - Ver usuarios
   - Eliminar usuarios
   - Limpiar toda la BD

#### Opción B: Desde Cualquier Componente 💻

```typescript
import { DatabaseService } from './src/services/DatabaseService';
import { Alert } from 'react-native';

// Limpiar solo usuarios
const clearUsers = async () => {
  Alert.alert(
    'Confirmar',
    '¿Eliminar todos los usuarios?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí',
        onPress: async () => {
          await DatabaseService.clearAllUsers();
          Alert.alert('✅', 'Usuarios eliminados');
        }
      }
    ]
  );
};

// Limpiar TODO
const clearAll = async () => {
  await DatabaseService.clearAllData();
  console.log('Base de datos limpiada');
};
```

#### Opción C: Desde la Consola del Navegador 🌐

1. Abre la app con Expo
2. Presiona `j` para abrir Chrome DevTools
3. En la consola:

```javascript
// Ver usuarios
(async () => {
  const { DatabaseService } = require('./src/services/DatabaseService');
  const users = await DatabaseService.getAllUsers();
  console.log('Usuarios:', users);
})();

// Limpiar usuarios
(async () => {
  const { DatabaseService } = require('./src/services/DatabaseService');
  await DatabaseService.clearAllUsers();
  console.log('✅ Usuarios eliminados');
})();
```

## 🎵 Generar Pistas de Audio

```bash
# Primera vez
pip3 install -r scripts/requirements.txt

# Generar audios
npm run generate-audio

# Verificar
npm run test-audio
```

## 📊 Ver Estado Actual

```typescript
import { DatabaseService } from './src/services/DatabaseService';

const checkDB = async () => {
  const stats = await DatabaseService.getDatabaseStats();
  console.log('📊 Base de Datos:');
  console.log(`   Usuarios: ${stats.totalUsers}`);
  console.log(`   Lecciones: ${stats.totalLessons}`);
  console.log(`   Usuario actual: ${stats.currentUser || 'Ninguno'}`);
};
```

## 🔄 Workflow de Desarrollo Típico

### Día a Día

```bash
# 1. Iniciar
npm start

# 2. Si necesitas resetear datos
# Usa DevTools en la app o:
```

```typescript
await DatabaseService.clearAllUsers();
```

### Testing de Usuarios

```bash
# 1. Limpiar
# DevTools → Eliminar Usuarios

# 2. Registrar usuario de prueba
# Pantalla de registro: test@test.com / password123

# 3. Probar flujo

# 4. Limpiar cuando termines
```

## 🐛 Problemas Comunes

### "Usuario no encontrado" después de desarrollo

```typescript
// Solución: Limpiar y hacer logout
await DatabaseService.clearAllUsers();
await AuthService.logout();
navigation.reset({
  index: 0,
  routes: [{ name: 'Login' }],
});
```

### Audio no se reproduce

```bash
# 1. Verificar archivos
ls -lh assets/audio/

# 2. Regenerar si faltan
npm run generate-audio

# 3. Reiniciar Metro
npm start -- --reset-cache
```

### Cambios no se reflejan

```bash
# Limpiar caché y reiniciar
rm -rf node_modules/.cache
npm start -- --reset-cache
```

## 📦 Scripts Útiles

```bash
# Desarrollo
npm start                 # Iniciar app
npm start -- --reset-cache  # Limpiar caché

# Audio
npm run generate-audio    # Generar audios
npm run test-audio        # Verificar audios

# Limpieza
rm -rf node_modules package-lock.json
npm install
```

## 🎯 Próximos Pasos

1. **Primer Run**
   - [ ] `npm install`
   - [ ] `npm run generate-audio`
   - [ ] `npm start`

2. **Agregar DevTools** (Opcional pero útil)
   - [ ] Importar `DevToolsScreen` en navegador
   - [ ] Agregar botón en perfil
   - [ ] Probar limpieza

3. **Crear Usuario de Prueba**
   - [ ] Registrar test@test.com
   - [ ] Completar una sesión
   - [ ] Ver estadísticas

4. **Desarrollo**
   - [ ] Hacer cambios
   - [ ] Probar en app
   - [ ] Limpiar BD cuando sea necesario

## 📖 Documentación Completa

- [BASE_DE_DATOS.md](./docs/BASE_DE_DATOS.md)
- [DATABASE_MANAGEMENT.md](./docs/DATABASE_MANAGEMENT.md)
- [AUDIO_GENERATION.md](./docs/AUDIO_GENERATION.md)
- [INSTRUCCIONES_EJECUCION.md](./docs/INSTRUCCIONES_EJECUCION.md)

