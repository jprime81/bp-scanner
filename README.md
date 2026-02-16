# BP Scanner App - Blood Pressure Monitor

A cross-platform React Native application for tracking and monitoring blood pressure readings with OCR scanning capabilities.

## Features

- ✅ Manual blood pressure entry with validation
- 📷 OCR scanning of BP device displays (placeholder - requires camera setup)
- 📊 Dashboard with latest readings and weekly statistics
- 📈 Reports and analytics (planned)
- 💾 Local SQLite database with encryption
- ☁️ Cloud backup via Firebase (planned)
- 🔐 Biometric authentication (planned)
- 🏥 Apple Health & Google Fit integration (planned)
- 📤 Share readings via native share sheet (planned)

## Getting Started

### Prerequisites

- Node.js >= 18
- React Native development environment setup
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

**Note:** You may see security warnings about the `ip` package. These affect only development CLI tools, not the production app, and can be safely ignored.

3. Install iOS pods:

```bash
cd ios && pod install && cd ..
```

4. Run the app:

For iOS:
```bash
npm run ios
```

For Android:
```bash
npm run android
```

## Project Structure

```
bp-scanner-app/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens
│   ├── services/         # Database, Firebase, Health services
│   ├── utils/            # Utility functions and helpers
│   ├── types/            # TypeScript type definitions
│   └── theme/            # Colors, typography, spacing
├── ios/                  # iOS native code
├── android/              # Android native code
└── App.tsx              # Main app entry point
```

## Configuration

### Firebase Setup (for cloud backup)

1. Create a Firebase project
2. Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
3. Place files in respective platform directories
4. Enable Firebase Authentication and Storage

### Health Integration

For iOS (HealthKit):
- Capability enabled in Xcode project
- Permissions declared in Info.plist

For Android (Google Fit):
- Google Fit API enabled in Google Cloud Console
- OAuth consent screen configured

## Development Status

### ✅ Completed
- Project structure and configuration
- TypeScript types and models
- SQLite database setup
- BP validation utilities
- OCR parser logic
- Theme system
- Dashboard screen
- Manual entry screen
- Readings list screen
- Basic navigation

### 🚧 In Progress
- Camera and OCR integration (requires additional packages - see OPTIONAL_DEPENDENCIES.md)
- Charts and reporting (chart-kit included, screens need implementation)
- Firebase cloud backup (Firebase packages included, configuration needed)
- Health platform sync (requires additional packages - see OPTIONAL_DEPENDENCIES.md)
- Settings screen (placeholder complete)
- Share functionality (package included, implementation needed)

### 📋 Planned
- Biometric authentication
- Reminders and notifications
- Data export (CSV, PDF)
- Onboarding flow
- Unit and integration tests

## Dependencies

Key libraries included:
- React Navigation - Navigation
- React Native SQLite Storage - Local database
- React Native Firebase - Cloud backup (Auth, Storage)
- React Native Chart Kit - Data visualization
- React Native Share - Share functionality
- React Native Date Picker - Date/time selection
- Async Storage - Settings storage

**Optional dependencies** (install when implementing specific features):
- Camera & OCR packages (vision-camera, ML Kit)
- Health integration (react-native-health, react-native-google-fit)
- Biometrics (react-native-biometrics)
- PDF export (react-native-html-to-pdf)

See [OPTIONAL_DEPENDENCIES.md](OPTIONAL_DEPENDENCIES.md) for installation instructions.

## License

This project is for educational/personal use.

## Support

For issues or questions, please file an issue in the repository.
