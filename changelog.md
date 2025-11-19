# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.0] - 2025-11-19

### Added
- **Pantalla de Configuración**: Nueva pantalla de configuración completa
  - Switch para activar/desactivar notificaciones generales
  - Configuración de recordatorio diario con selector de hora
  - Notificaciones por email (preparado para implementación futura)
  - Control de sonido durante meditaciones
  - Selector de tema oscuro/claro
  - Información de la aplicación (Acerca de, Ayuda, Privacidad)
  - Opción para resetear progreso (preparado para implementación futura)
  - Acceso desde el botón "⚙️ Configuración" en el perfil
- **Sistema de Notificaciones Push**: Recordatorios diarios completamente funcionales
  - `NotificationService.ts` - Servicio completo de gestión de notificaciones
  - Integración con `expo-notifications@0.29.14`
  - Selector de hora personalizado con `@react-native-community/datetimepicker@8.2.0`
  - Modal elegante para selección de hora (nativo en Android/iOS)
  - Notificaciones recurrentes diarias a hora programada
  - Persistencia de configuración en AsyncStorage
  - Solicitud de permisos de notificaciones
  - Configuración de canal de notificaciones en Android
  - Mensaje personalizado: "🧘 Momento de Meditar"
- **Sistema de Temas**: Modo oscuro completo en toda la aplicación
  - `ThemeContext.tsx` - Contexto global de temas
  - Hook personalizado `useTheme()` para acceder al tema actual
  - Paleta de colores completa para modo claro y oscuro
  - Persistencia de preferencia de tema en AsyncStorage
  - Cambio instantáneo de tema en toda la aplicación
  - Todas las pantallas adaptadas (excepto Login/Register por diseño)
- **Integración con ThemeProvider**: Toda la app envuelta en ThemeProvider
  - HomeScreen con tema dinámico
  - ProfileScreen con tema dinámico
  - MeditationScreen con tema dinámico
  - SettingsScreen con tema dinámico
  - MeditationCard componente con tema dinámico

### Changed
- **ProfileScreen**: 
  - Botón de configuración agregado para acceder a settings
  - Ajuste visual del contador de Betterflies (texto oscuro fijo para ambos temas)
- **App.tsx**: Refactorización para envolver toda la app en ThemeProvider
- **Navegación**: Ruta "Settings" agregada al stack de navegación
- **app.json**: Configuración de permisos de notificaciones para Android
  - Permisos: RECEIVE_BOOT_COMPLETED, VIBRATE, SCHEDULE_EXACT_ALARM
  - Plugin de expo-notifications configurado

### Fixed
- Color del número de Betterflies en modo oscuro (ahora siempre se ve correctamente)
- Trigger de notificaciones usando CalendarTrigger para notificaciones recurrentes
- Estilos de todas las pantallas para soportar tema dinámico

### Technical Details
- **Nuevos Archivos**:
  - `src/contexts/ThemeContext.tsx` - Sistema de temas
  - `src/services/NotificationService.ts` - Gestión de notificaciones
  - `src/screens/SettingsScreen.tsx` - Pantalla de configuración
- **Dependencias Nuevas**:
  - `expo-notifications@0.29.14`
  - `@react-native-community/datetimepicker@8.2.0`
- **Paleta de Colores**:
  - Modo Claro: Fondo `#F8F9FA`, Tarjetas `#FFFFFF`, Texto `#2C3E50`
  - Modo Oscuro: Fondo `#121212`, Tarjetas `#2C2C2C`, Texto `#FFFFFF`
  - Color Primario: `#4ECDC4` (turquesa - igual en ambos modos)

## [1.5.0] - 2025-10-22

### Added
- **AI-Generated Audio**: Integration with ElevenLabs API for meditation audio generation
- **Audio Generation Scripts**: Python scripts to generate meditation audio tracks
  - `scripts/generate_audio.py` - Main audio generation script
  - `scripts/meditation_scripts.py` - Meditation text scripts in Spanish
  - `scripts/test_audio.py` - Audio verification script
  - `scripts/regenerate_audio.sh` - Automated audio regeneration
  - `scripts/update_durations.py` - Utility to extract real audio durations
- **Audio Tracks**: 3 AI-generated meditation tracks with ElevenLabs
  - `sleep-test.mp3` (~12 seconds)
  - `relaxation-morning.mp3` (~1.6 minutes)
  - `selfawareness-mindful.mp3` (~1.9 minutes)
- **Role System**: User roles (user/admin) for access control
  - `role` field added to User interface
  - Admin verification methods in AuthService
- **Admin System**: Complete administrator functionality
  - Automatic admin user seed (`admin@meditation.app` / `admin123`)
  - AdminGuard component for route protection
  - DevToolsScreen for database management (admin only)
  - Admin badge display in Profile screen
  - Admin-only button to access DevTools
- **Database Management Tools**:
  - View database statistics (users, lessons, current user)
  - List all users with details
  - Clear all users
  - Clear entire database
  - Back button in DevTools to return to profile
- **Automatic Migration**: User migration system for role field and null values
- **NPM Scripts**:
  - `npm run generate-audio` - Generate audio tracks
  - `npm run test-audio` - Verify audio files
  - `npm run regenerate-audio` - Full audio regeneration
  - `npm run admin-info` - Display admin credentials
- **Documentation**:
  - `docs/AUDIO_GENERATION.md` - Complete audio generation guide
  - `docs/ADMIN_SYSTEM.md` - Admin system documentation
  - `docs/DATABASE_MANAGEMENT.md` - Database management guide
  - `scripts/README_AUDIO.md` - Quick audio setup guide
  - `ADMIN_QUICK_GUIDE.md` - Quick admin access guide
  - `CHANGELOG_AUDIO.md` - Audio integration changelog
  - `CHANGELOG_SISTEMA_ADMIN.md` - Admin system changelog

### Changed
- **Audio Integration**: Meditation sessions now use real AI-generated audio files
- **Duration Synchronization**: Session durations now match actual audio file lengths
  - Sleep Test: 0.20 minutes (was ~0.12)
  - Relaxation Morning: 1.62 minutes (was 10)
  - Self-awareness Mindful: 1.87 minutes (was 10)
- **Decimal Precision**: All minutes now display with 2 decimal places
  - HomeScreen statistics
  - ProfileScreen statistics
  - MeditationScreen duration
  - MeditationCard duration display
- **Database Service**: Enhanced with seed and migration capabilities
- **User Registration**: Now accepts optional `role` parameter (defaults to 'user')
- **Total Minutes**: Changed from integer to decimal with 2-digit precision
- **Betterflies Formula**: Updated to use floor(minutes) for calculation
- **Audio Mode Configuration**: Added iOS/Android audio mode settings
- **SplashScreen Animation**: Loading bar now uses `scaleX` transform instead of `width`

### Fixed
- **Null Safety**: Added validation for null/undefined values in:
  - totalMinutes display (all screens)
  - session.duration display
  - User progress loading
- **Animation Error**: Fixed "width not supported by native animated module" error
  - Changed from `width` animation to `transform: scaleX`
- **Navigation**: Corrected AdminGuard redirect route from 'MainApp' to 'MainTabs'
- **Data Integrity**: Automatic migration fixes null numeric fields (totalMinutes, totalSessions, betterflies)

### Security
- **Route Protection**: DevToolsScreen protected with AdminGuard
- **Role Verification**: Automatic admin status check on profile load
- **Access Control**: Non-admin users automatically redirected from protected routes
- **Seed Safety**: Admin user seed doesn't create duplicates

### Technical
- **ElevenLabs Integration**:
  - Model: eleven_multilingual_v2 (Spanish support)
  - Voice: JBFqnCBsd6RMkjVDRZzb (calm, soft voice)
  - Format: MP3, 44.1kHz, 128kbps
- **Audio Files**: Stored in `assets/audio/` (not tracked in git)
- **Python Dependencies**: `elevenlabs`, `python-dotenv`
- **Environment Variables**: `.env` file for ElevenLabs API key
- **Database Migration**: Automatic role field addition and null value correction

## [1.3.0] - 2025-10-21

### Added
- Points system (betterflies) with formula: `minutes × 2 + floor(streak / 3) + 1`
- Category tracking (sleep, relaxation, self-awareness)
- Favorite session type display in profile with visual breakdown
- Date-based streak system with `lastLessonDate` field
- Automatic streak reset after 2+ days of inactivity
- Streak verification on login
- 3 meditation categories: Sleep, Relaxation, Self-Awareness
- 3 meditation sessions (one per category)
- 7-second test session for Sleep category
- User data now includes: `sleepCompleted`, `relaxationCompleted`, `selfAwarenessCompleted`, `totalSessions`, `totalMinutes`, `betterflies`, `lastLessonDate`
- Synchronized statistics between Home and Profile screens
- Visual breakdown of completed sessions by category

### Changed
- Meditation categories reduced from 5 to 3 (Sleep, Relaxation, Self-Awareness)
- Meditation sessions reduced from 6 to 3 (one per category)
- Streak now increments only once per day (multiple sessions per day don't increase streak)
- Profile screen now displays betterflies with Betterflie.png icon
- Profile screen shows favorite session type based on most completed category
- Home screen now uses real user data instead of legacy storage
- Test session moved to Sleep category (7 seconds)
- User model updated with new tracking fields
- Points calculation now includes base point (+1)

### Removed
- "Reset Progress" button from profile screen
- Achievements section (commented out for future implementation)
- Concentration category replaced with Self-Awareness
- Anxiety and Focus categories removed
- Multiple sessions per category reduced to one

### Fixed
- Streak logic now prevents inflation from multiple daily sessions
- Profile and Home screens now show consistent data
- Category counters properly increment on lesson completion
- Proper handling of first-time users (streak = 1 on first lesson)

## [1.2.0] - 2025-10-20

### Added
- Complete authentication system (AuthService)
- Login screen with email and password validation
- Registration screen with user creation
- Splash screen with sequential fade animations
- Logo integration in splash, login, and register screens
- Session persistence with AsyncStorage
- Logout button in profile screen with confirmation dialog
- Auto-check for active session (every 1 second)
- Exit confirmation dialog for meditation sessions
- Keyboard dismiss on tap outside input fields
- Back button interception with warning dialog

### Changed
- Splash animation from rotation to sequential fade
- Replaced emoji icons with splash.png logo
- Profile screen now shows user information (username, email)
- App.tsx now handles authentication state management
- Meditation screen removed redundant back button
- Title spacing adjusted in meditation header

### Fixed
- Session verification on app foreground
- Proper cleanup of audio and intervals on exit
- Logout functionality now properly redirects to login

## [1.1.0] - 2025-10-20

### Added
- Simplified database system (`DatabaseService`)
- Local storage with AsyncStorage
- "Back" button in meditation screen
- Auto-start of sessions when opening a lesson
- Two-line visual timer (current time / total duration)

### Changed
- Pause button now changes color (green/red) according to state
- Type simplification: `User` and `Lesson`
- Update to Expo SDK 54
- React 19.1.0 and React Native 0.81.4

### Fixed
- Pause functionality in simulated mode
- Proper cleanup of intervals when pausing/exiting

## [1.0.0] - 2025-10-15

### Added
- Navigation with Bottom Tabs (Home, Meditation, Profile)
- Main screen with meditation sessions
- User progress tracking and statistics
- Reusable components (Button, MeditationCard)
- Initial project documentation

### Technical
- Expo and React Native configuration
- React Navigation integration
- TypeScript throughout the project
- Modular folder structure

