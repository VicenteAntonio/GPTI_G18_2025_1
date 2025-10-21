// ========== USUARIO ==========
export interface User {
  username: string;           // Nombre de usuario
  email: string;              // Email
  password: string;           // Contraseña
  role: 'user' | 'admin';     // Rol del usuario
  streak: number;             // Racha actual
  sleepCompleted: number;     // Lecciones de sueño completadas
  relaxationCompleted: number; // Lecciones de relajación completadas
  selfAwarenessCompleted: number; // Lecciones de autoconciencia completadas
  longestStreak: number;      // Racha más larga
  achievements: string[];     // Logros
  betterflies: number;        // Betterflies ganadas
  totalSessions: number;      // Total de sesiones completadas
  totalMinutes: number;       // Total de minutos meditados (con decimales)
  lastLessonDate: string | null; // Fecha de última lección (ISO string: YYYY-MM-DD)
}

// ========== LECCIÓN ==========
export interface Lesson {
  lessonType: string;         // Tipo de lección (sueño, relajación, autoconciencia)
  lessonName: string;         // Nombre de lección
  lessonId: string;           // Identificador de lección
  lessonTime: number;         // Tiempo de lección (en minutos)
  lessonAudio: string;        // Audio de lección (URI)
}

// ========== TIPOS AUXILIARES (para la UI) ==========
export interface MeditationCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: MeditationCategory;
  audioFile?: any; // Archivo de audio local (require)
  audioUrl?: string; // URL de audio remoto (legacy)
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: Date;
}

export interface MeditationPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  session: MeditationSession | null;
}
