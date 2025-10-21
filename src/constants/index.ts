import { MeditationCategory } from '../types';

export const MEDITATION_CATEGORIES: MeditationCategory[] = [
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

export const STORAGE_KEYS = {
  // Legacy keys (mantener compatibilidad)
  USER_PROGRESS: '@user_progress',
  COMPLETED_SESSIONS: '@completed_sessions',
  
  // New storage keys
  AUDIO_TRACKS: '@audio_tracks',
  AUDIO_METADATA: '@audio_metadata',
  LESSONS: '@meditation_lessons',
  USERS: '@users',
  CURRENT_USER: '@current_user',
};

// Mapeo de archivos de audio
const AUDIO_FILES = {
  'sleep-test': require('../../assets/audio/sleep-test.mp3'),
  'relaxation-morning': require('../../assets/audio/relaxation-morning.mp3'),
  'selfawareness-mindful': require('../../assets/audio/selfawareness-mindful.mp3'),
};

export const MEDITATION_SESSIONS = [
  {
    id: 'sleep-test',
    title: 'Sueño Rápido',
    description: 'Sesión express de sueño (12 seg - PRUEBA)',
    duration: 11.833438 / 60, // Duración real del audio en minutos (~0.197 min)
    category: MEDITATION_CATEGORIES[0], // sueño
    audioFile: AUDIO_FILES['sleep-test'],
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
  },
  {
    id: 'relaxation-morning',
    title: 'Relajación Matutina',
    description: 'Comienza tu día con paz y tranquilidad',
    duration: 96.914250 / 60, // Duración real del audio en minutos (~1.62 min)
    category: MEDITATION_CATEGORIES[1], // relajación
    audioFile: AUDIO_FILES['relaxation-morning'],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    id: 'selfawareness-mindful',
    title: 'Consciencia Plena',
    description: 'Conecta con tu yo interior y el momento presente',
    duration: 112.274250 / 60, // Duración real del audio en minutos (~1.87 min)
    category: MEDITATION_CATEGORIES[2], // autoconciencia
    audioFile: AUDIO_FILES['selfawareness-mindful'],
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400',
  },
];
