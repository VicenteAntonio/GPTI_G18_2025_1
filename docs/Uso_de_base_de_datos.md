# 📝 Ejemplo de Uso - Base de Datos

## Inicialización Simple

```typescript
import { DatabaseService } from './src/services';

// Crear usuario demo y lecciones de ejemplo
await DatabaseService.initDemoUser();
await DatabaseService.initDemoLessons();
```

## Usar en la App

### 1. Crear un nuevo usuario

```typescript
const newUser = {
  username: 'María',
  email: 'maria@mail.com',
  password: 'pass123',
  streak: 0,
  relaxationCompleted: 0,
  selfAwarenessCompleted: 0,
  concentrationCompleted: 0,
  longestStreak: 0,
  achievements: []
};

await DatabaseService.saveUser(newUser);
await DatabaseService.setCurrentUser(newUser.email);
```

### 2. Agregar una lección

```typescript
const newLesson = {
  lessonId: 'rel-002',
  lessonName: 'Respiración Consciente',
  lessonType: 'relajación',
  lessonTime: 5,
  lessonAudio: 'file:///breathe.mp3'
};

await DatabaseService.saveLesson(newLesson);
```

### 3. Cuando el usuario completa una lección

```typescript
const user = await DatabaseService.getCurrentUser();

// Actualizar progreso según el tipo de lección
await DatabaseService.updateUserProgress(user.email, 'relaxation');

// Verificar progreso actualizado
const updatedUser = await DatabaseService.getCurrentUser();
console.log(`Relajación completadas: ${updatedUser.relaxationCompleted}`);
console.log(`Racha actual: ${updatedUser.streak}`);
console.log(`Mejor racha: ${updatedUser.longestStreak}`);
```

### 4. Mostrar lecciones por tipo

```typescript
// Obtener todas las lecciones de relajación
const relaxationLessons = await DatabaseService.getLessonsByType('relajación');

// Mostrar en la UI
relaxationLessons.forEach(lesson => {
  console.log(`${lesson.lessonName} - ${lesson.lessonTime} min`);
});
```

---

## ¡Eso es todo! 🎉

Simple y directo. Sin complicaciones.

