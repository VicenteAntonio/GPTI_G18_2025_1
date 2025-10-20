# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

