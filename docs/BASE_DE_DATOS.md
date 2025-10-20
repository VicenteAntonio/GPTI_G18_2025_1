# Base de Datos - Sistema de Almacenamiento Local

## 📋 Descripción General

La aplicación utiliza **AsyncStorage** para almacenar datos localmente en el dispositivo del usuario. El sistema está diseñado para ser simple, eficiente y no requiere conexión a internet.

## 🗂️ Estructura de Datos

### 1. Usuario (User)

```typescript
interface User {
  username: string;                    // Nombre de usuario
  email: string;                       // Email (usado como identificador único)
  password: string;                    // Contraseña (sin encriptar en esta versión)
  streak: number;                      // Racha actual de días consecutivos
  sleepCompleted: number;              // Lecciones de sueño completadas
  relaxationCompleted: number;         // Lecciones de relajación completadas
  selfAwarenessCompleted: number;      // Lecciones de autoconciencia completadas
  longestStreak: number;               // Racha más larga alcanzada
  achievements: string[];              // Logros obtenidos (futuro)
  betterflies: number;                 // Puntos ganados
  totalSessions: number;               // Total de sesiones completadas
  totalMinutes: number;                // Total de minutos meditados (entero)
  lastLessonDate: string | null;       // Fecha de última lección (YYYY-MM-DD)
}
```

### 2. Lección (Lesson)

```typescript
interface Lesson {
  lessonId: string;          // Identificador único de lección
  lessonName: string;        // Nombre de la lección
  lessonType: string;        // Tipo: "sueño", "relajación", "autoconciencia"
  lessonTime: number;        // Duración en minutos
  lessonAudio: string;       // URI del audio (file:/// o http://)
}
```

### 3. Sesión de Autenticación (AuthSession)

```typescript
interface AuthSession {
  isLoggedIn: boolean;       // Estado de autenticación
  userEmail: string | null;  // Email del usuario autenticado
}
```

## 🔑 Claves de Almacenamiento (Storage Keys)

```typescript
const STORAGE_KEYS = {
  // Sistema de autenticación
  AUTH_SESSION: '@auth_session',
  
  // Base de datos principal
  USERS: '@users',
  LESSONS: '@meditation_lessons',
  CURRENT_USER: '@current_user',
  
  // Legacy (compatibilidad con versiones anteriores)
  USER_PROGRESS: '@user_progress',
  COMPLETED_SESSIONS: '@completed_sessions',
  AUDIO_TRACKS: '@audio_tracks',
  AUDIO_METADATA: '@audio_metadata',
};
```

## 📊 Servicios de Base de Datos

### DatabaseService

Servicio principal para gestión de usuarios y lecciones.

#### Métodos de Usuario

```typescript
// Guardar o actualizar usuario
static async saveUser(user: User): Promise<void>

// Obtener todos los usuarios
static async getAllUsers(): Promise<User[]>

// Obtener usuario por email
static async getUserByEmail(email: string): Promise<User | null>

// Establecer usuario actual
static async setCurrentUser(email: string): Promise<void>

// Obtener usuario actual
static async getCurrentUser(): Promise<string | null>
```

#### Métodos de Lecciones

```typescript
// Guardar o actualizar lección
static async saveLesson(lesson: Lesson): Promise<void>

// Obtener todas las lecciones
static async getAllLessons(): Promise<Lesson[]>

// Obtener lección por ID
static async getLessonById(lessonId: string): Promise<Lesson | null>

// Obtener lecciones por tipo
static async getLessonsByType(lessonType: string): Promise<Lesson[]>
```

#### Métodos de Progreso

```typescript
// Completar lección (actualiza progreso, racha, puntos)
static async completeLesson(
  userEmail: string, 
  lessonMinutes: number, 
  categoryId: string
): Promise<{
  user: User;
  betterfliesEarned: number;
} | null>

// Verificar y resetear racha si han pasado 2+ días
static async checkAndResetStreak(user: User): Promise<void>

// Obtener categoría favorita del usuario
static getFavoriteCategory(user: User): {
  name: string;
  icon: string;
  count: number;
} | null
```

#### Métodos Auxiliares

```typescript
// Limpiar toda la base de datos
static async clearAll(): Promise<void>

// Inicializar usuario de prueba
static async initDemoUser(): Promise<User>

// Inicializar lecciones de ejemplo
static async initDemoLessons(): Promise<void>
```

### AuthService

Servicio de autenticación y gestión de sesiones.

```typescript
// Verificar si hay usuario logueado
static async isUserLoggedIn(): Promise<boolean>

// Obtener sesión actual
static async getSession(): Promise<AuthSession>

// Iniciar sesión
static async login(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
}>

// Registrar nuevo usuario
static async register(
  username: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<{
  success: boolean;
  error?: string;
}>

// Cerrar sesión
static async logout(): Promise<void>

// Obtener usuario actual autenticado
static async getCurrentLoggedUser(): Promise<User | null>
```

## 📐 Fórmulas y Lógica de Negocio

### Sistema de Puntos (Betterflies)

```typescript
betterflies = (minutos × 2) + floor(racha / 3) + 1
```

**Ejemplos:**
- Primera sesión de 0 minutos (7 seg): `(0 × 2) + floor(1/3) + 1 = 1`
- Segunda sesión de 10 minutos: `(10 × 2) + floor(2/3) + 1 = 21`
- Racha de 9 días, sesión de 15 minutos: `(15 × 2) + floor(9/3) + 1 = 34`

### Sistema de Racha

**Reglas:**
1. **Primera lección**: `streak = 1`
2. **Día siguiente**: `streak = streak + 1`
3. **Mismo día**: `streak` se mantiene (no incrementa)
4. **2+ días sin meditar**: `streak = 0` (al iniciar sesión)
5. **Completar lección después de 2+ días**: `streak = 1`

**Verificación:**
- Al iniciar sesión: `checkAndResetStreak()` verifica `lastLessonDate`
- Al completar lección: calcula días desde `lastLessonDate`

### Categoría Favorita

**Criterio:**
- Categoría con más sesiones completadas
- En caso de empate: mantiene el orden de prioridad
  1. Sueño 😴
  2. Relajación 🧘
  3. Autoconciencia 🌸

## 🗄️ Categorías de Meditación

```typescript
const MEDITATION_CATEGORIES = [
  {
    id: 'sleep',
    name: 'Sueño',
    color: '#4ECDC4',
    icon: '😴',
  },
  {
    id: 'relaxation',
    name: 'Relajación',
    color: '#FF6B6B',
    icon: '🧘',
  },
  {
    id: 'selfawareness',
    name: 'Autoconciencia',
    color: '#96CEB4',
    icon: '🌸',
  },
];
```

## 🎯 Sesiones Disponibles

```typescript
const MEDITATION_SESSIONS = [
  {
    id: 'sleep-test',
    title: 'Sueño Rápido',
    description: 'Sesión express de sueño (7 seg - PRUEBA)',
    duration: 7 / 60,  // 7 segundos
    category: 'sleep',
  },
  {
    id: 'relaxation-morning',
    title: 'Relajación Matutina',
    description: 'Comienza tu día con paz y tranquilidad',
    duration: 10,  // 10 minutos
    category: 'relaxation',
  },
  {
    id: 'selfawareness-mindful',
    title: 'Consciencia Plena',
    description: 'Conecta con tu yo interior y el momento presente',
    duration: 10,  // 10 minutos
    category: 'selfawareness',
  },
];
```

## 🔄 Flujo de Datos

### Registro de Usuario
```
Usuario → RegisterScreen → AuthService.register() 
  → DatabaseService.saveUser() → AsyncStorage
```

### Login
```
Usuario → LoginScreen → AuthService.login()
  → DatabaseService.getUserByEmail()
  → DatabaseService.checkAndResetStreak()
  → AsyncStorage (guarda sesión)
```

### Completar Lección
```
Usuario completa sesión → MeditationScreen.completeSession()
  → DatabaseService.completeLesson()
    → Calcula minutos enteros
    → Verifica días desde lastLessonDate
    → Actualiza racha según reglas
    → Calcula betterflies ganadas
    → Incrementa contador de categoría
    → Actualiza totalSessions y totalMinutes
    → Guarda lastLessonDate actual
  → Muestra alert con resumen
  → Actualiza UI (Home y Profile)
```

### Actualización de Estadísticas
```
Usuario navega a Home/Profile
  → useFocusEffect se activa
  → AuthService.getCurrentLoggedUser()
  → Muestra datos actualizados
```

## 🔐 Seguridad

**Nota Importante:** Esta versión almacena las contraseñas sin encriptar. Para producción, se recomienda:

1. Implementar hash de contraseñas (bcrypt, argon2)
2. Usar tokens JWT para sesiones
3. Implementar refresh tokens
4. Agregar 2FA (autenticación de dos factores)
5. Encriptar datos sensibles en AsyncStorage

## 📦 Migración de Datos

La aplicación maneja automáticamente usuarios existentes:

```typescript
// Los campos faltantes se inicializan automáticamente
if (existingUser && !existingUser.betterflies) {
  existingUser.betterflies = 0;
  existingUser.lastLessonDate = null;
  // ... otros campos nuevos
}
```

## 🧪 Datos de Prueba

### Usuario Demo
```typescript
{
  username: 'Usuario Demo',
  email: 'demo@meditacion.app',
  password: 'demo123',
  streak: 0,
  sleepCompleted: 0,
  relaxationCompleted: 0,
  selfAwarenessCompleted: 0,
  longestStreak: 0,
  achievements: [],
  betterflies: 0,
  totalSessions: 0,
  totalMinutes: 0,
  lastLessonDate: null,
}
```

### Lecciones Demo
```typescript
[
  {
    lessonId: 'sleep-1',
    lessonName: 'Sueño Profundo',
    lessonType: 'sueño',
    lessonTime: 15,
    lessonAudio: 'file:///sleep-1.mp3',
  },
  {
    lessonId: 'relaxation-1',
    lessonName: 'Relajación Matutina',
    lessonType: 'relajación',
    lessonTime: 10,
    lessonAudio: 'file:///relaxation-1.mp3',
  },
  {
    lessonId: 'selfawareness-1',
    lessonName: 'Consciencia Plena',
    lessonType: 'autoconciencia',
    lessonTime: 10,
    lessonAudio: 'file:///selfawareness-1.mp3',
  },
]
```

## 🛠️ Utilidades de Desarrollo

### Limpiar Base de Datos
```typescript
await DatabaseService.clearAll();
```

### Inicializar Datos Demo
```typescript
await DatabaseService.initDemoUser();
await DatabaseService.initDemoLessons();
```

### Ver Datos en AsyncStorage (Debug)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ver todos los usuarios
const usersJson = await AsyncStorage.getItem('@users');
const users = JSON.parse(usersJson);
console.log('Users:', users);

// Ver sesión actual
const sessionJson = await AsyncStorage.getItem('@auth_session');
const session = JSON.parse(sessionJson);
console.log('Session:', session);
```

## 📚 Referencias

- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
- [React Native Storage](https://reactnative.dev/docs/asyncstorage)

