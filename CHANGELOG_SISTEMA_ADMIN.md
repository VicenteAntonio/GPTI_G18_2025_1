# 🔐 Changelog - Sistema de Administración

## Resumen de Cambios

Se ha implementado un sistema completo de roles y administración con:
- Usuario administrador creado automáticamente
- Protección de rutas administrativas
- Pantalla de herramientas de desarrollo (DevTools)
- Migración automática de usuarios existentes

## 📋 Cambios Detallados

### 1. Tipos y Modelos

#### `src/types/index.ts`
```typescript
export interface User {
  // ... campos existentes ...
  role: 'user' | 'admin';  // ← NUEVO CAMPO
}
```

**Descripción**: Agregado campo `role` para distinguir entre usuarios normales y administradores.

### 2. Servicios

#### `src/services/AuthService.ts`

**Nuevos Métodos**:

```typescript
// Verificar si el usuario actual es admin
static async isCurrentUserAdmin(): Promise<boolean>

// Verificar si un email es admin
static async isUserAdmin(email: string): Promise<boolean>
```

**Método Actualizado**:

```typescript
// Ahora acepta parámetro 'role' (por defecto 'user')
static async register(
  username: string,
  email: string,
  password: string,
  role: 'user' | 'admin' = 'user'
): Promise<{ success: boolean; error?: string }>
```

#### `src/services/DatabaseService.ts`

**Nuevos Métodos**:

```typescript
// Crear usuario admin si no existe
static async seedDatabase(): Promise<void>

// Migrar usuarios existentes para agregar campo 'role'
static async migrateUsersAddRole(): Promise<void>

// Métodos de limpieza (ya documentados)
static async clearAllUsers(): Promise<void>
static async clearAllData(): Promise<void>
static async getDatabaseStats(): Promise<{...}>
```

### 3. Utilidades

#### `src/utils/AdminGuard.tsx` (NUEVO)

Componente de protección de rutas administrativas.

**Características**:
- Verifica si el usuario actual es admin
- Redirige automáticamente si no es admin
- Muestra spinner mientras verifica
- No muestra errores al usuario (silencioso)

**Uso**:
```typescript
const DevToolsScreen = () => (
  <AdminGuard>
    <DevToolsScreenContent />
  </AdminGuard>
);
```

### 4. Pantallas

#### `src/screens/DevToolsScreen.tsx` (ACTUALIZADA)

**Nuevas Características**:
- Protegida con `AdminGuard`
- Muestra nombre del admin actual
- Badge visual de "Admin"
- Todas las funciones originales mantenidas

**Cambios**:
```typescript
// Antes
const DevToolsScreen: React.FC = () => { ... }

// Ahora
const DevToolsScreenContent: React.FC = () => { ... }
const DevToolsScreen = () => (
  <AdminGuard>
    <DevToolsScreenContent />
  </AdminGuard>
);
```

### 5. Aplicación Principal

#### `App.tsx`

**Nuevo Hook**:
```typescript
// Seed automático al iniciar
useEffect(() => {
  const initializeDatabase = async () => {
    await DatabaseService.seedDatabase();
  };
  initializeDatabase();
}, []);
```

**Descripción**: Ejecuta el seed de la base de datos cada vez que se inicia la app.

### 6. Scripts

#### `scripts/seed_admin.js` (NUEVO)

Script informativo que muestra:
- Credenciales del administrador
- Cómo funciona el seed
- Instrucciones de acceso
- Advertencias de seguridad

**Uso**:
```bash
npm run admin-info
```

#### `package.json`

**Nuevo Script**:
```json
{
  "scripts": {
    "admin-info": "node scripts/seed_admin.js"
  }
}
```

### 7. Documentación

#### Nuevos Archivos:

1. **`docs/ADMIN_SYSTEM.md`**
   - Documentación completa del sistema
   - Guía de seguridad
   - Ejemplos de código
   - Troubleshooting

2. **`ADMIN_QUICK_GUIDE.md`**
   - Guía rápida de acceso
   - Credenciales
   - Operaciones comunes
   - Troubleshooting básico

3. **`CHANGELOG_SISTEMA_ADMIN.md`** (este archivo)
   - Resumen de todos los cambios
   - Referencias técnicas

## 🎯 Funcionalidades del Sistema

### Usuario Administrador

**Credenciales (desarrollo)**:
```
Email:    admin@meditation.app
Password: admin123
Rol:      admin
```

### Creación Automática

1. Al iniciar la app, se ejecuta `DatabaseService.seedDatabase()`
2. Verifica si existe `admin@meditation.app`
3. Si no existe, lo crea
4. Si existe, no hace nada

### Migración Automática

Los usuarios existentes sin campo `role` se actualizan automáticamente:
- Se les asigna `role: 'user'` por defecto
- La migración se ejecuta en cada seed
- No afecta a usuarios que ya tienen rol

### Protección de Rutas

Pantallas protegidas con `AdminGuard`:
- **DevToolsScreen**: Solo administradores
- Más pantallas pueden protegerse fácilmente

## 🚀 Cómo Usar

### Como Desarrollador

1. **Iniciar la app**:
   ```bash
   npm start
   ```

2. **Login como admin**:
   - Email: `admin@meditation.app`
   - Password: `admin123`

3. **Acceder a DevTools**:
   - Navegar a la pantalla DevTools
   - Gestionar usuarios y base de datos

### Ver Información del Admin

```bash
npm run admin-info
```

### Crear Más Administradores

```typescript
await AuthService.register(
  'Nuevo Admin',
  'nuevo.admin@example.com',
  'password',
  'admin' // ← Especificar rol
);
```

### Promover Usuario a Admin

```typescript
const user = await DatabaseService.getUserByEmail('user@example.com');
if (user) {
  user.role = 'admin';
  await DatabaseService.saveUser(user);
}
```

## ⚠️ Seguridad

### Producción

**IMPORTANTE**: Antes de deployment:

1. **Cambiar contraseña del admin**:
   ```typescript
   // En DatabaseService.seedDatabase()
   password: process.env.ADMIN_PASSWORD || 'fallback_password'
   ```

2. **Ocultar DevTools**:
   ```typescript
   {__DEV__ && (
     <Stack.Screen name="DevTools" component={DevToolsScreen} />
   )}
   ```

3. **Hash de contraseñas**:
   - Usar bcrypt u otra librería
   - No almacenar contraseñas en texto plano

4. **Variables de entorno**:
   - Usar `.env` para credenciales
   - No commitear credenciales

## 📊 Estadísticas

### Archivos Modificados: 8
- `src/types/index.ts`
- `src/services/AuthService.ts`
- `src/services/DatabaseService.ts`
- `src/screens/DevToolsScreen.tsx`
- `App.tsx`
- `package.json`
- `README.md`
- `docs/DATABASE_MANAGEMENT.md` (indirecto)

### Archivos Creados: 5
- `src/utils/AdminGuard.tsx`
- `scripts/seed_admin.js`
- `docs/ADMIN_SYSTEM.md`
- `ADMIN_QUICK_GUIDE.md`
- `CHANGELOG_SISTEMA_ADMIN.md`

### Líneas de Código: ~800+
- Código TypeScript: ~400 líneas
- Documentación: ~400 líneas
- Scripts: ~50 líneas

## 🔄 Migración de Datos

### Usuarios Existentes

Los usuarios creados antes de este cambio se actualizan automáticamente:

```typescript
// Antes del cambio
{
  email: "user@example.com",
  username: "Usuario",
  // ... sin campo 'role'
}

// Después de la migración
{
  email: "user@example.com",
  username: "Usuario",
  role: "user", // ← Agregado automáticamente
  // ...
}
```

### Compatibilidad

✅ **Retrocompatible**: Los usuarios existentes siguen funcionando
✅ **Sin pérdida de datos**: Todos los datos se mantienen
✅ **Migración automática**: No requiere intervención manual

## 📝 Testing

### Verificar Sistema

```typescript
// 1. Verificar que el admin se creó
const admin = await DatabaseService.getUserByEmail('admin@meditation.app');
console.log('Admin:', admin);

// 2. Verificar migración
const users = await DatabaseService.getAllUsers();
users.forEach(u => {
  console.log(`${u.email}: ${u.role}`);
});

// 3. Verificar protección
const isAdmin = await AuthService.isCurrentUserAdmin();
console.log('¿Soy admin?', isAdmin);
```

## 🎉 Próximos Pasos

### Para el Desarrollador

1. Agregar `DevToolsScreen` al navegador
2. Agregar botón de acceso en perfil (opcional)
3. Probar login como admin
4. Usar DevTools para gestión

### Para Producción

1. Cambiar credenciales del admin
2. Implementar hash de contraseñas
3. Usar variables de entorno
4. Ocultar DevTools en producción
5. Implementar logging de acciones admin

## 📚 Referencias

- **Documentación Completa**: `docs/ADMIN_SYSTEM.md`
- **Guía Rápida**: `ADMIN_QUICK_GUIDE.md`
- **Gestión de BD**: `docs/DATABASE_MANAGEMENT.md`
- **Código Principal**: 
  - `src/services/AuthService.ts`
  - `src/services/DatabaseService.ts`
  - `src/utils/AdminGuard.tsx`

