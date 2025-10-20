# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added
- Sistema de base de datos simplificado (`DatabaseService`)
- Botón de "Volver" en pantalla de meditación
- Auto-inicio de sesiones al abrir una lección
- Temporizador visual de dos líneas (tiempo actual / duración total)

### Changed
- Botón de pause ahora cambia de color (verde/rojo) según estado
- Simplificación de tipos: `User` y `Lesson`
- Actualización a Expo SDK 54
- React 19.1.0 y React Native 0.81.4

### Fixed
- Funcionalidad de pause en modo simulado
- Limpieza apropiada de intervalos al pausar/salir

## [1.0.0] - 2025-10-20

### Added
- Navegación con Bottom Tabs (Home, Meditation, Profile)
- Pantalla principal con sesiones de meditación
- Reproductor de audio básico con play/pause
- Sistema de categorías (Mindfulness, Sueño, Ansiedad, Concentración, Respiración)
- Almacenamiento local con AsyncStorage
- Seguimiento de progreso y estadísticas de usuario
- Componentes reutilizables (Button, MeditationCard)
- Documentación inicial del proyecto

### Technical
- Configuración de Expo y React Native
- Integración de React Navigation
- TypeScript en todo el proyecto
- Estructura modular de carpetas

---

## Tipos de cambios

- `Added` - Para nuevas funcionalidades
- `Changed` - Para cambios en funcionalidades existentes
- `Deprecated` - Para funcionalidades que serán eliminadas
- `Removed` - Para funcionalidades eliminadas
- `Fixed` - Para corrección de bugs
- `Security` - Para vulnerabilidades de seguridad

---

[Unreleased]: https://github.com/tu-usuario/tu-repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/tu-usuario/tu-repo/releases/tag/v1.0.0

