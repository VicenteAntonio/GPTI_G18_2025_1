# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

