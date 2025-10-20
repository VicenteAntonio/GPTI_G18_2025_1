// ========== USUARIO ==========
export interface User {
  username: string;           // Nombre de usuario
  email: string;              // Email
  password: string;           // Contraseña
  streak: number;             // Racha actual
  relaxationCompleted: number; // Lecciones de relajación completadas
  selfAwarenessCompleted: number; // Lecciones de autoconciencia completadas
  concentrationCompleted: number; // Lecciones de concentración completadas
  longestStreak: number;      // Racha más larga
  achievements: string[];     // Logros
}

// ========== LECCIÓN ==========
export interface Lesson {
  lessonType: string;         // Tipo de lección (relajación, autoconciencia, concentración)
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
  audioUrl?: string;
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
