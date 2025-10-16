import { MeditationCategory } from '../types';

export const MEDITATION_CATEGORIES: MeditationCategory[] = [
  {
    id: 'mindfulness',
    name: 'Mindfulness',
    color: '#FF6B6B',
    icon: '🧘',
  },
  {
    id: 'sleep',
    name: 'Sueño',
    color: '#4ECDC4',
    icon: '😴',
  },
  {
    id: 'anxiety',
    name: 'Ansiedad',
    color: '#45B7D1',
    icon: '🌊',
  },
  {
    id: 'focus',
    name: 'Concentración',
    color: '#96CEB4',
    icon: '🎯',
  },
  {
    id: 'breathing',
    name: 'Respiración',
    color: '#FFEAA7',
    icon: '💨',
  },
];

export const STORAGE_KEYS = {
  USER_PROGRESS: '@user_progress',
  COMPLETED_SESSIONS: '@completed_sessions',
};

export const MEDITATION_SESSIONS = [
  {
    id: 'morning-mindfulness',
    title: 'Meditación Matutina',
    description: 'Una meditación suave para comenzar el día con claridad mental',
    duration: 10,
    category: MEDITATION_CATEGORIES[0], // mindfulness
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    id: 'sleep-relaxation',
    title: 'Relajación para Dormir',
    description: 'Una sesión profunda para preparar tu mente para el descanso',
    duration: 15,
    category: MEDITATION_CATEGORIES[1], // sleep
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
  },
  {
    id: 'anxiety-relief',
    title: 'Alivio de Ansiedad',
    description: 'Técnicas de respiración para calmar la mente ansiosa',
    duration: 12,
    category: MEDITATION_CATEGORIES[2], // anxiety
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
  },
  {
    id: 'focus-boost',
    title: 'Impulso de Concentración',
    description: 'Mejora tu enfoque y productividad mental',
    duration: 8,
    category: MEDITATION_CATEGORIES[3], // focus
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68e2c6de8f?w=400',
  },
  {
    id: 'breathing-exercise',
    title: 'Ejercicio de Respiración',
    description: 'Técnicas básicas de respiración consciente',
    duration: 5,
    category: MEDITATION_CATEGORIES[4], // breathing
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
];
