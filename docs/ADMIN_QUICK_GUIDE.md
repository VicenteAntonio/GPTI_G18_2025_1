# 🔐 Guía Rápida del Usuario Administrador

## Credenciales del Admin

```
📧 Email:    admin@meditation.app
🔑 Password: admin123
👤 Rol:      admin
```

## Acceso Rápido

### 1. Ver Información del Admin
```bash
npm run admin-info
```

### 2. Iniciar Sesión

1. Inicia la aplicación:
   ```bash
   npm start
   ```

2. En la pantalla de login, usa:
   - **Email**: `admin@meditation.app`
   - **Password**: `admin123`

### 3. Acceder a DevTools

Una vez logueado como admin, puedes acceder a la pantalla de **DevTools** que te permite:

- 📊 Ver estadísticas de la base de datos
- 📋 Listar todos los usuarios
- 🗑️ Eliminar todos los usuarios
- 💣 Limpiar toda la base de datos

## ¿Cómo funciona?

### Creación Automática

El usuario admin se crea **automáticamente** al iniciar la app:

1. La app ejecuta `DatabaseService.seedDatabase()` en `App.tsx`
2. Verifica si existe `admin@meditation.app`
3. Si no existe, lo crea con rol `admin`
4. Si ya existe, no hace nada

### Protección de Rutas

La pantalla **DevTools** está protegida con `AdminGuard`:

- ✅ **Usuario Admin**: Puede acceder
- ❌ **Usuario Normal**: Se redirige automáticamente al Home
- ❌ **Sin Login**: Se redirige al Login

## Agregar DevTools al Navegador

Para acceder a DevTools desde la app, necesitas agregar la pantalla al navegador:

### Paso 1: Editar `src/navigation/AppNavigator.tsx`

```typescript
import DevToolsScreen from '../screens/DevToolsScreen';

// Dentro del Stack.Navigator, agregar:
<Stack.Screen 
  name="DevTools" 
  component={DevToolsScreen}
  options={{ 
    title: 'Herramientas de Desarrollo',
    headerShown: true
  }}
/>
```

### Paso 2: Agregar Botón de Acceso (Opcional)

En `ProfileScreen.tsx`, puedes agregar un botón para ir a DevTools:

```typescript
{__DEV__ && (
  <Button
    title="🛠️ Dev Tools (Admin)"
    onPress={() => navigation.navigate('DevTools' as any)}
    style={{ marginTop: 20 }}
  />
)}
```

O mejor aún, solo mostrarlo si es admin:

```typescript
const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  const checkAdmin = async () => {
    const admin = await AuthService.isCurrentUserAdmin();
    setIsAdmin(admin);
  };
  checkAdmin();
}, []);

// En el render:
{isAdmin && (
  <Button
    title="🛠️ Dev Tools"
    onPress={() => navigation.navigate('DevTools' as any)}
  />
)}
```

## Operaciones Comunes

### Ver Todos los Usuarios

```typescript
import { DatabaseService } from './src/services/DatabaseService';

const users = await DatabaseService.getAllUsers();
console.log('Usuarios:', users);
```

### Eliminar Todos los Usuarios

```typescript
await DatabaseService.clearAllUsers();
console.log('✅ Usuarios eliminados');
```

### Verificar si Soy Admin

```typescript
import { AuthService } from './src/services/AuthService';

const isAdmin = await AuthService.isCurrentUserAdmin();
console.log('¿Soy admin?', isAdmin);
```

### Promover Usuario a Admin

```typescript
// Obtener el usuario
const user = await DatabaseService.getUserByEmail('usuario@example.com');

// Cambiar rol
if (user) {
  user.role = 'admin';
  await DatabaseService.saveUser(user);
  console.log('✅ Usuario promovido a admin');
}
```

## Troubleshooting

### No puedo acceder a DevTools

1. Verifica que estás logueado como admin:
   ```typescript
   const user = await AuthService.getCurrentLoggedUser();
   console.log('Usuario actual:', user);
   console.log('Rol:', user?.role);
   ```

2. Si el rol no es 'admin', actualízalo manualmente:
   ```typescript
   if (user) {
     user.role = 'admin';
     await DatabaseService.saveUser(user);
   }
   ```

### El admin no se creó

Fuerza la creación del seed:

```typescript
import { DatabaseService } from './src/services/DatabaseService';
await DatabaseService.seedDatabase();
```

### Olvidé la contraseña del admin

La contraseña está hardcodeada en el código (solo desarrollo):

- Contraseña: `admin123`
- Ubicación: `src/services/DatabaseService.ts` → `seedDatabase()`

### Resetear todo y empezar de cero

```typescript
// 1. Limpiar todo
await DatabaseService.clearAllData();

// 2. Recrear admin
await DatabaseService.seedDatabase();

// 3. Hacer login con admin@meditation.app / admin123
```

## Seguridad

⚠️ **IMPORTANTE PARA PRODUCCIÓN**:

1. **Cambiar la contraseña**:
   - Edita `src/services/DatabaseService.ts`
   - Cambia `password: 'admin123'` por una contraseña segura
   - O usa variables de entorno

2. **Ocultar DevTools**:
   ```typescript
   // Solo mostrar en desarrollo
   {__DEV__ && (
     <Stack.Screen name="DevTools" ... />
   )}
   ```

3. **Hash de contraseñas**:
   - En producción, usa bcrypt o similar
   - No guardes contraseñas en texto plano

## Scripts Útiles

```bash
# Ver info del admin
npm run admin-info

# Iniciar la app
npm start

# Generar audios (requiere login como admin)
npm run generate-audio
```

## Archivos Relacionados

- `src/types/index.ts` - Definición del tipo User con campo `role`
- `src/services/AuthService.ts` - Métodos de verificación de admin
- `src/services/DatabaseService.ts` - Seed del admin y migración
- `src/utils/AdminGuard.tsx` - Protección de rutas admin
- `src/screens/DevToolsScreen.tsx` - Pantalla de herramientas
- `App.tsx` - Inicialización del seed
- `docs/ADMIN_SYSTEM.md` - Documentación completa

## Documentación Completa

Para más detalles, consulta:
- **[ADMIN_SYSTEM.md](./docs/ADMIN_SYSTEM.md)** - Documentación completa del sistema de administración
- **[DATABASE_MANAGEMENT.md](./docs/DATABASE_MANAGEMENT.md)** - Gestión de base de datos

