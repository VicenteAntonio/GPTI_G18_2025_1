# 🔐 Sistema de Administración

Documentación completa del sistema de roles y administración de la aplicación de meditación.

## 📋 Índice

1. [Sistema de Roles](#sistema-de-roles)
2. [Usuario Administrador](#usuario-administrador)
3. [Protección de Rutas](#protección-de-rutas)
4. [Seed de Base de Datos](#seed-de-base-de-datos)
5. [Uso del Sistema](#uso-del-sistema)
6. [Seguridad](#seguridad)

## Sistema de Roles

La aplicación tiene dos roles de usuario:

### Roles Disponibles

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| `user` | Usuario normal | Acceso a meditaciones, perfil, estadísticas |
| `admin` | Administrador | Todo lo de `user` + acceso a DevTools |

### Estructura del Tipo User

```typescript
export interface User {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';  // ← Nuevo campo
  // ... otros campos
}
```

## Usuario Administrador

### Credenciales Por Defecto

```
Email:    admin@meditation.app
Password: admin123
Rol:      admin
```

⚠️ **IMPORTANTE**: Estas son credenciales de desarrollo. En producción, cámbialas inmediatamente.

### Creación Automática

El usuario administrador se crea automáticamente al iniciar la aplicación mediante el **seed** de la base de datos.

#### Cómo Funciona

1. La app inicia y ejecuta `DatabaseService.seedDatabase()`
2. Verifica si existe un usuario con email `admin@meditation.app`
3. Si no existe, lo crea con rol `admin`
4. Si ya existe, no hace nada (evita duplicados)

#### Ubicación del Código

```typescript
// src/services/DatabaseService.ts
static async seedDatabase(): Promise<void> {
  const adminEmail = 'admin@meditation.app';
  const existingAdmin = await this.getUserByEmail(adminEmail);
  
  if (!existingAdmin) {
    const adminUser: User = {
      username: 'Administrador',
      email: adminEmail,
      password: 'admin123',
      role: 'admin',
      // ... otros campos
    };
    
    await this.saveUser(adminUser);
    console.log('✅ Usuario administrador creado');
  }
}
```

## Protección de Rutas

### AdminGuard Component

El componente `AdminGuard` protege rutas que solo deben ser accesibles por administradores.

#### Uso

```typescript
import { AdminGuard } from '../utils/AdminGuard';

const DevToolsScreen = () => {
  return (
    <AdminGuard>
      <DevToolsScreenContent />
    </AdminGuard>
  );
};
```

#### Comportamiento

1. **Usuario Admin**: 
   - Muestra un spinner mientras verifica
   - Permite acceso y renderiza el contenido

2. **Usuario Normal**: 
   - Muestra un spinner brevemente
   - Redirige automáticamente al Home
   - No muestra mensaje de error (silencioso)

3. **Usuario No Logueado**: 
   - Redirige al Home/Login
   - No permite acceso

#### Código del Guard

```typescript
// src/utils/AdminGuard.tsx
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const userIsAdmin = await AuthService.isCurrentUserAdmin();
    
    if (!userIsAdmin) {
      // Redirigir al Home
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainApp' }],
      });
      return;
    }
    
    setIsAdmin(true);
    setIsChecking(false);
  };

  if (isChecking) {
    return <LoadingSpinner />;
  }

  return isAdmin ? <>{children}</> : null;
};
```

## Seed de Base de Datos

### Ejecución Automática

El seed se ejecuta en `App.tsx` al iniciar la aplicación:

```typescript
// App.tsx
useEffect(() => {
  const initializeDatabase = async () => {
    await DatabaseService.seedDatabase();
  };
  
  initializeDatabase();
}, []);
```

### Ver Información del Seed

```bash
node scripts/seed_admin.js
```

Este script muestra información sobre el usuario administrador.

### Verificar que se Creó

```typescript
import { DatabaseService } from './src/services/DatabaseService';

// Ver todos los usuarios
const users = await DatabaseService.getAllUsers();
console.log(users);

// Buscar el admin específicamente
const admin = await DatabaseService.getUserByEmail('admin@meditation.app');
console.log('Admin:', admin);
```

## Uso del Sistema

### Flujo de Autenticación Admin

1. **Iniciar App**
   ```bash
   npm start
   ```

2. **Login como Admin**
   - Email: `admin@meditation.app`
   - Password: `admin123`

3. **Acceder a DevTools**
   - Navegar a la pantalla DevTools
   - El AdminGuard verifica automáticamente
   - Si eres admin, accedes
   - Si no, te redirige al Home

### Métodos de Verificación

```typescript
import { AuthService } from './src/services/AuthService';

// Verificar si el usuario actual es admin
const isAdmin = await AuthService.isCurrentUserAdmin();
if (isAdmin) {
  console.log('Usuario actual es admin');
}

// Verificar si un email específico es admin
const isAdminEmail = await AuthService.isUserAdmin('admin@meditation.app');
```

### Crear Más Administradores

```typescript
import { AuthService } from './src/services/AuthService';

// Registrar un nuevo usuario como admin
await AuthService.register(
  'Nuevo Admin',
  'nuevo.admin@example.com',
  'password123',
  'admin' // ← Especificar rol admin
);
```

### Promover Usuario a Admin

```typescript
import { DatabaseService } from './src/services/DatabaseService';

// Obtener el usuario
const user = await DatabaseService.getUserByEmail('usuario@example.com');

if (user) {
  // Cambiar su rol
  user.role = 'admin';
  
  // Guardar cambios
  await DatabaseService.saveUser(user);
  
  console.log('✅ Usuario promovido a admin');
}
```

## Seguridad

### ⚠️ Advertencias Importantes

1. **Credenciales en Código**
   ```typescript
   // ❌ MAL: Credenciales en código (solo desarrollo)
   password: 'admin123'
   
   // ✅ BIEN: Usar variables de entorno (producción)
   password: process.env.ADMIN_PASSWORD || 'default_temp_password'
   ```

2. **Ocultar DevTools en Producción**
   ```typescript
   // Solo mostrar en desarrollo
   {__DEV__ && (
     <Stack.Screen name="DevTools" component={DevToolsScreen} />
   )}
   ```

3. **Hash de Contraseñas**
   ```typescript
   // TODO: En producción, usar bcrypt o similar
   import bcrypt from 'bcrypt';
   
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

### Mejores Prácticas

#### 1. Cambiar Contraseña en Primera Ejecución

```typescript
const shouldForcePasswordChange = (user: User): boolean => {
  return user.role === 'admin' && user.password === 'admin123';
};

// En el login
if (shouldForcePasswordChange(user)) {
  navigation.navigate('ChangePassword', { forced: true });
}
```

#### 2. Auditoría de Acciones Admin

```typescript
const logAdminAction = async (action: string) => {
  const user = await AuthService.getCurrentLoggedUser();
  console.log(`[ADMIN] ${user?.email}: ${action} at ${new Date().toISOString()}`);
  
  // Guardar en base de datos o servicio de logs
};

// Uso
await logAdminAction('Deleted all users');
```

#### 3. Configuración de Producción

```typescript
// config.ts
export const CONFIG = {
  ADMIN_EMAIL: __DEV__ 
    ? 'admin@meditation.app' 
    : process.env.ADMIN_EMAIL,
  
  ADMIN_PASSWORD: __DEV__ 
    ? 'admin123' 
    : process.env.ADMIN_PASSWORD,
    
  ENABLE_DEVTOOLS: __DEV__, // Solo en desarrollo
};
```

#### 4. Verificación de Doble Factor (Opcional)

```typescript
// Para acciones críticas
const requireConfirmation = async (action: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      '⚠️ Acción de Administrador',
      `Confirma: ${action}`,
      [
        { text: 'Cancelar', onPress: () => resolve(false), style: 'cancel' },
        { text: 'Confirmar', onPress: () => resolve(true), style: 'destructive' }
      ]
    );
  });
};

// Uso
if (await requireConfirmation('Eliminar todos los usuarios')) {
  await DatabaseService.clearAllUsers();
}
```

## Testing

### Probar Sistema de Roles

```typescript
describe('Admin System', () => {
  beforeEach(async () => {
    await DatabaseService.clearAllData();
    await DatabaseService.seedDatabase();
  });

  test('Crea usuario admin en seed', async () => {
    const admin = await DatabaseService.getUserByEmail('admin@meditation.app');
    expect(admin).toBeDefined();
    expect(admin?.role).toBe('admin');
  });

  test('Usuario normal no puede acceder a DevTools', async () => {
    await AuthService.register('User', 'user@test.com', 'pass');
    await AuthService.login('user@test.com', 'pass');
    
    const isAdmin = await AuthService.isCurrentUserAdmin();
    expect(isAdmin).toBe(false);
  });

  test('Admin puede acceder a DevTools', async () => {
    await AuthService.login('admin@meditation.app', 'admin123');
    
    const isAdmin = await AuthService.isCurrentUserAdmin();
    expect(isAdmin).toBe(true);
  });
});
```

## Troubleshooting

### Admin no puede acceder a DevTools

```typescript
// Verificar que el usuario es realmente admin
const user = await AuthService.getCurrentLoggedUser();
console.log('Usuario actual:', user);
console.log('Rol:', user?.role);

// Si el rol no es 'admin', actualizar manualmente
if (user && user.role !== 'admin') {
  user.role = 'admin';
  await DatabaseService.saveUser(user);
  console.log('✅ Rol actualizado');
}
```

### Seed no se ejecuta

```typescript
// Forzar seed manualmente
import { DatabaseService } from './src/services/DatabaseService';

await DatabaseService.seedDatabase();
```

### Resetear todo y recrear admin

```typescript
// Limpiar base de datos
await DatabaseService.clearAllData();

// Recrear admin
await DatabaseService.seedDatabase();

// Verificar
const admin = await DatabaseService.getUserByEmail('admin@meditation.app');
console.log('Admin recreado:', admin);
```

## Roadmap

### Próximas Mejoras

- [ ] Hash de contraseñas con bcrypt
- [ ] Variables de entorno para credenciales
- [ ] Auditoría de acciones de admin
- [ ] Múltiples niveles de permisos
- [ ] Interfaz para gestionar roles
- [ ] Logs de acceso a DevTools
- [ ] Autenticación de dos factores
- [ ] Expiración de sesiones admin

## Referencias

- `src/types/index.ts` - Definición de tipos
- `src/services/AuthService.ts` - Autenticación y verificación de roles
- `src/services/DatabaseService.ts` - Seed y gestión de BD
- `src/utils/AdminGuard.tsx` - Protección de rutas
- `src/screens/DevToolsScreen.tsx` - Pantalla protegida
- `App.tsx` - Inicialización del seed

