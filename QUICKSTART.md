# BP Scanner App - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher): [Download](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js
- **React Native CLI**: `npm install -g react-native-cli`
- **Watchman** (macOS): `brew install watchman`

### For iOS Development (macOS only):
- **Xcode** (14+): Install from App Store
- **CocoaPods**: `sudo gem install cocoapods`
- **iOS Simulator**: Installed with Xcode

### For Android Development:
- **Android Studio**: [Download](https://developer.android.com/studio)
- **Android SDK** (API 24+): Install via Android Studio
- **Java Development Kit (JDK 17)**: [Download](https://adoptium.net/)

## Initial Setup

### 1. Install Dependencies

```bash
# Navigate to project directory
cd /home/james-bagoy/Projects/bp-scanner-app

# Install npm packages
npm install

# For iOS (macOS only)
cd ios
pod install
cd ..
```

### 2. Set Up Environment

Create a `.env` file in the project root:

```env
# App Configuration
APP_VERSION=1.0.0
APP_NAME=BP Scanner

# Firebase (add your values after Firebase setup)
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
```

## Firebase Setup (Optional for MVP)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add iOS app:
   - Bundle ID: `com.bpscannerapp`
   - Download `GoogleService-Info.plist`
   - Place in `ios/BPScannerApp/`
4. Add Android app:
   - Package name: `com.bpscannerapp`
   - Download `google-services.json`
   - Place in `android/app/`
5. Enable Authentication (Email/Password, Google)
6. Enable Cloud Storage

## Running the App

### iOS (macOS only)

```bash
# Start Metro bundler
npm start

# In another terminal, run iOS
npm run ios

# Or specify a simulator
npm run ios -- --simulator="iPhone 15 Pro"
```

### Android

```bash
# Start Metro bundler
npm start

# In another terminal, run Android
npm run android

# Or specify a device
adb devices  # List connected devices
npm run android -- --deviceId=<device-id>
```

## Available Features (Current Build)

### ✅ Working Features:
- **Manual BP Entry**: Add blood pressure readings with full validation
- **Dashboard**: View latest reading and weekly statistics
- **Readings List**: See all your readings in chronological order
- **Local Storage**: All data stored securely with SQLite
- **BP Categorization**: Automatic categorization (Normal, Elevated, High, Crisis)
- **Data Validation**: Real-time validation of entered values

### 🚧 Placeholder Features (To Be Implemented):
- **Camera Scanning**: Shows placeholder UI (requires vision-camera - see OPTIONAL_DEPENDENCIES.md)
- **Charts/Reports**: Placeholder screen (chart-kit included, needs screen implementation)
- **Cloud Backup**: Interface ready (requires Firebase project configuration)
- **Health Sync**: Interface ready (requires native packages - see OPTIONAL_DEPENDENCIES.md)
- **Settings**: Placeholder screen (full implementation pending)
- **Biometric Lock**: Not yet included (install package when needed - see OPTIONAL_DEPENDENCIES.md)

## Testing the App

### Manual Testing Flow

1. **Add Your First Reading**:
   - Tap "Add Reading" on dashboard
   - Enter: Systolic (120), Diastolic (80), Pulse (72)
   - Select arm and position
   - Add optional notes
   - Tap "Save Reading"

2. **View Your Readings**:
   - Navigate to "Readings" tab
   - See your reading displayed with category badge
   - Notes: Readings are sorted newest first

3. **Check Dashboard Stats**:
   - Return to "Home" tab
   - See latest reading card
   - View weekly statistics (appears after multiple readings)

4. **Test Validation**:
   - Try adding invalid values (e.g., Systolic: 300)
   - Should see validation errors

### Run Unit Tests

```bash
npm test
```

Tests cover:
- BP validation logic
- Category determination
- OCR text parsing
- CSV export formatting

## Troubleshooting

### Common Issues

**Metro bundler won't start**:
```bash
npm start -- --reset-cache
```

**iOS build fails**:
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

**Android build fails**:
```bash
cd android
./gradlew clean
cd ..
npm run android
```

**Database errors**:
- Delete app from simulator/device and reinstall
- This will reset the local database

**Cannot find module errors**:
```bash
rm -rf node_modules
npm install
```

### Debugging

**Enable debug mode**:
- iOS: Cmd + D in simulator
- Android: Cmd/Ctrl + M or shake device

**View logs**:
```bash
# iOS
npx react-native log-ios

# Android
npx react-native log-android
```

**Inspect database** (iOS Simulator):
```bash
# Find database file
find ~/Library/Developer/CoreSimulator -name "bp_scanner.db"

# Open with SQLite browser
sqlite3 <path-to-db>
```

## Development Workflow

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes in `src/` directory
3. Test thoroughly on both platforms
4. Run `npm run lint` to check code style
5. Run `npm test` to ensure tests pass
6. Commit changes: `git commit -m "Add: your feature"`

### Code Organization

```
src/
├── components/       # Reusable UI components (Button, Card, etc.)
├── screens/          # Full screen components
├── services/         # Business logic (Database, Cloud, Health)
├── utils/            # Helper functions
├── types/            # TypeScript type definitions
└── theme/            # Design system (colors, spacing, typography)
```

### Best Practices

- **Components**: Keep them small and focused
- **Services**: Use singleton pattern for shared services
- **Types**: Always define TypeScript types for new data structures
- **Styling**: Use theme constants for consistency
- **Testing**: Write tests for utility functions and complex logic

## Next Steps

### Immediate (No Additional Setup Required):
1. ✅ Add multiple readings to test list and dashboard
2. ✅ Test data validation with edge cases
3. ✅ Explore the navigation flow

### Short Term (Requires Some Setup):
1. 📷 Implement camera scanning (see `docs/implementation-guide.md`)
2. 📊 Add chart visualizations
3. 💾 Set up Firebase for cloud backup
4. 🔐 Implement biometric authentication

### Long Term (Full Feature Set):
1. 🏥 Integrate with HealthKit/Google Fit
2. 📱 Add widgets for iOS and Android
3. 📄 Implement PDF report generation
4. 🌐 Localization for multiple languages
5. 📲 Push notifications for reminders

## Resources & Documentation

- **Full Implementation Guide**: `docs/implementation-guide.md`
- **iOS Setup**: `docs/ios-setup.md`
- **Android Setup**: `docs/android-setup.md`
- **API Documentation**: See inline TypeScript types in `src/types/`

### External Resources

- [React Native Docs](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase for React Native](https://rnfirebase.io/)
- [Vision Camera](https://react-native-vision-camera.com/)
- [SQLite Storage](https://github.com/andpor/react-native-sqlite-storage)

## Support

For issues or questions:
1. Check `docs/implementation-guide.md` for detailed instructions
2. Review error logs using debug tools
3. Search React Native documentation
4. File an issue in the project repository

## Version Info

- **App Version**: 1.0.0 (MVP)
- **React Native**: 0.73.2
- **Node.js**: >= 18
- **iOS Deployment**: >= 13.0
- **Android Min SDK**: 24 (Android 7.0)

---

**Happy Coding! 🩺📱**

Start by running `npm start` and then `npm run ios` or `npm run android` to see your app in action!
