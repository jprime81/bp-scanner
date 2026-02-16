# BP Scanner App - Implementation Guide

## Overview

This document provides a comprehensive guide for completing the BP Scanner App implementation.

## Current Status

### ✅ Completed Components

1. **Project Foundation**
   - React Native TypeScript setup
   - Package configuration with all required dependencies
   - Build configuration for iOS and Android
   - Git setup with proper .gitignore

2. **Data Layer**
   - TypeScript type definitions for all data models
   - SQLite database schema and service
   - BP validation utilities
   - OCR text parsing logic
   - Local storage with encryption support

3. **UI Components**
   - Theme system (colors, typography, spacing)
   - Reusable Button component
   - BP Reading Card component
   - Screen layouts and navigation structure

4. **Core Screens**
   - Dashboard with latest reading and weekly stats
   - Add Reading screen with full form validation
   - Readings List with chronological display
   - Placeholder screens for Reports, Settings, Camera

5. **Services (Interfaces Ready)**
   - Database service (fully implemented)
   - Cloud backup service (Firebase interface)
   - Health integration service (HealthKit/Google Fit interface)
   - Share service (native share sheet integration)

6. **Utilities**
   - BP categorization (AHA guidelines)
   - Reading validation
   - CSV export
   - OCR text parsing

### 🚧 Remaining Work

## Phase 1: Native Module Setup (Prerequisites)

### 1.1 iOS Setup
```bash
cd ios
pod install
cd ..
```

Required Info.plist additions (see `docs/ios-setup.md`):
- Camera permissions
- HealthKit permissions
- Face ID permissions

### 1.2 Android Setup

Required AndroidManifest.xml additions (see `docs/android-setup.md`):
- Camera permissions
- Health Connect permissions
- Internet permissions

### 1.3 Firebase Configuration

**iOS:**
1. Create Firebase project at https://console.firebase.google.com
2. Add iOS app with bundle ID: `com.bpscannerapp`
3. Download `GoogleService-Info.plist`
4. Add to Xcode project

**Android:**
1. Add Android app with package name: `com.bpscannerapp`
2. Download `google-services.json`
3. Place in `android/app/`

## Phase 2: Camera & OCR Implementation

### 2.1 Install Vision Camera
```bash
npm install react-native-vision-camera
cd ios && pod install && cd ..
```

### 2.2 Implement CameraScreen

Update `src/screens/CameraScreen.tsx`:

```typescript
import {Camera, useCameraDevice, useCodeScanner} from 'react-native-vision-camera';
import TextRecognition from '@react-native-ml-kit/text-recognition';

// Request camera permissions
const { hasPermission, requestPermission } = useCameraPermission();

// Implement capture and OCR
const captureAndRecognize = async () => {
  const photo = await camera.current.takePhoto();
  const result = await TextRecognition.recognize(photo.path);
  const parsed = BPParser.parseOCRText(result.text);
  // Show confirmation dialog with parsed values
};
```

### 2.3 Image Preprocessing

Add image processing utilities:
```bash
npm install react-native-image-manipulator
```

Implement preprocessing for better OCR accuracy:
- Grayscale conversion
- Contrast adjustment
- Noise reduction

## Phase 3: Charts & Reporting

### 3.1 Install Charting Library
```bash
npm install react-native-chart-kit react-native-svg
```

### 3.2 Implement ReportsScreen

Update `src/screens/ReportsScreen.tsx`:

```typescript
import { LineChart } from 'react-native-chart-kit';

// Implement three tabs:
// - Daily: All readings for selected day
// - Weekly: Daily averages for past 7 days
// - Monthly: Weekly averages for past 4 weeks

// Add statistics overlay:
// - Min/Max/Average BP
// - Color-coded zones (normal/elevated/high)
// - Trend indicators
```

### 3.3 Implement Chart Components

Create components:
- `DailyChart.tsx` - Time-series for single day
- `WeeklyChart.tsx` - Daily averages
- `MonthlyChart.tsx` - Weekly averages
- `StatisticsCard.tsx` - Summary stats

## Phase 4: Cloud Backup Integration

### 4.1 Firebase Authentication

Implement auth screens:
```typescript
// src/screens/AuthScreen.tsx
// - Email/password sign up
// - Email/password sign in
// - Google Sign-In button
```

### 4.2 Google Sign-In Setup
```bash
npm install @react-native-google-signin/google-signin
```

Configure:
- iOS: Add URL scheme to Info.plist
- Android: Add SHA-1 fingerprint to Firebase Console

### 4.3 Implement Backup Flow

Update `CloudBackupService.ts` - Already has interfaces, needs:
1. Call `createBackup()` after adding reading
2. Add setting to enable/disable auto-backup
3. Implement backup schedule (daily/weekly)

### 4.4 Restore Flow

Create `BackupListScreen.tsx`:
- Show available backups
- Display backup date, size, record count
- Restore button with confirmation
- Delete backup option

## Phase 5: Health Platform Integration

### 5.1 iOS - HealthKit

```bash
npm install react-native-health
cd ios && pod install && cd ..
```

Enable HealthKit capability in Xcode.

Update `HealthIntegrationService.ts`:
- Implement `saveToHealthKit()` with actual API calls
- Implement `readFromHealthKit()` for importing data

### 5.2 Android - Google Fit

```bash
npm install react-native-google-fit
```

Configure OAuth in Google Cloud Console.

Update `HealthIntegrationService.ts`:
- Implement `saveToGoogleFit()` with actual API calls
- Implement `readFromGoogleFit()` for importing data

### 5.3 Settings Toggle

Add to SettingsScreen:
- Enable/disable auto-sync to health platforms
- Button to manually trigger sync
- Last sync timestamp display

## Phase 6: Settings & Security

### 6.1 Biometric Authentication

```bash
npm install react-native-biometrics
```

Implement:
- App lock on launch
- Settings to enable/disable
- Fallback to PIN if biometric fails

### 6.2 Implement SettingsScreen

Create sections:
```typescript
// Security
- Biometric lock toggle
- Auto-lock timeout picker (5/10/30 minutes)

// Cloud Backup
- Sign in status
- Auto-backup toggle
- Manual backup button
- View backups button

// Health Integration
- HealthKit/Google Fit connection status
- Auto-sync toggle
- Sync now button

// Data Management
- Export all data (CSV/JSON)
- Clear all data (with confirmation)
- Import data from file

// Preferences
- Default arm (left/right)
- Default position (sitting/standing/lying)
- Reminder settings

// About
- App version
- Privacy policy link
- Terms of service link
```

## Phase 7: Additional Features

### 7.1 Reminders

```bash
npm install @react-native-community/push-notification-ios
npm install react-native-push-notification
```

Implement:
- Daily reminder to take BP reading
- Time picker for reminder
- Local notifications (no server needed)

### 7.2 Data Export Enhancements

Add PDF export:
```bash
npm install react-native-pdf react-native-html-to-pdf
```

Create PDF report with:
- Summary statistics
- Chart visualizations
- Reading history table

### 7.3 Widgets (Advanced)

iOS Widgets and Android Home Screen widgets showing:
- Latest reading
- Today's average
- Week trend indicator

## Phase 8: Testing & Polish

### 8.1 Unit Tests

Create test files:
```bash
npm install --save-dev @testing-library/react-native
```

Test:
- BPUtils validation functions
- BPParser OCR parsing
- Database CRUD operations
- Component rendering

### 8.2 Integration Tests

Test flows:
- Add reading → View in list → Edit → Delete
- Scan BP device → Confirm values → Save
- Create backup → Restore backup
- Sync to health platform

### 8.3 UI Polish

- Add loading states for all async operations
- Implement error boundaries
- Add skeleton loaders
- Smooth animations/transitions
- Empty state illustrations
- Onboarding flow for first launch

### 8.4 Accessibility

- VoiceOver/TalkBack support
- Dynamic font sizes
- Color contrast validation
- Screen reader labels

## Phase 9: App Store Preparation

### 9.1 Assets

Create:
- App icon (1024x1024)
- Splash screen
- App Store screenshots (various sizes)
- App Store preview video (optional)

### 9.2 Metadata

Prepare:
- App description
- Keywords for discoverability
- Privacy policy (required for health apps)
- Terms of service
- Support URL

### 9.3 Build & Submit

iOS:
```bash
cd ios
fastlane init
# Configure fastlane for App Store submission
```

Android:
```bash
cd android
./gradlew bundleRelease
# Upload to Google Play Console
```

## Development Tips

### Running the App

```bash
# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on specific device
npm run ios -- --simulator="iPhone 15 Pro"
npm run android -- --deviceId=<device-id>
```

### Debugging

- Use React Native Debugger
- Enable Hermes debugger in Chrome DevTools
- Use Flipper for network inspection

### Performance

- Use React.memo for expensive components
- Implement FlatList pagination for large reading lists
- Optimize database queries with proper indexes
- Use SQLite transactions for batch operations

## Common Issues & Solutions

### Issue: Pod install fails on iOS
**Solution:** 
```bash
cd ios
pod deintegrate
pod install
```

### Issue: Metro bundler cache issues
**Solution:**
```bash
npm start -- --reset-cache
```

### Issue: Android build fails
**Solution:**
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### Issue: SQLite database locked
**Solution:** Ensure proper database connection management, close connections after use

## Security Checklist

- [ ] All API keys in environment variables (never commit)
- [ ] Enable SQLCipher for database encryption
- [ ] Implement certificate pinning for Firebase
- [ ] Sanitize user inputs
- [ ] Implement rate limiting for API calls
- [ ] Enable ProGuard for Android release builds
- [ ] No sensitive data in logs for production builds

## Performance Checklist

- [ ] Optimize images (use WebP on Android, HEIC on iOS)
- [ ] Enable Hermes engine
- [ ] Implement code splitting
- [ ] Use native navigation for better performance
- [ ] Optimize FlatList with key extraction and item layout
- [ ] Implement image caching
- [ ] Minimize re-renders with proper memoization

## Accessibility Checklist

- [ ] All interactive elements have accessibility labels
- [ ] Color contrast meets WCAG AA standards
- [ ] Dynamic type support
- [ ] VoiceOver/TalkBack navigation works correctly
- [ ] Form inputs have proper labels
- [ ] Error messages are announced to screen readers

## Next Steps

1. Run `bash setup.sh` to install dependencies
2. Follow iOS/Android setup docs to configure native modules
3. Set up Firebase project and add config files
4. Implement camera/OCR functionality
5. Build out remaining features according to phases above

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Firebase Documentation](https://rnfirebase.io/)
- [Vision Camera](https://react-native-vision-camera.com/)
- [ML Kit Text Recognition](https://developers.google.com/ml-kit/vision/text-recognition)
- [Apple HealthKit](https://developer.apple.com/documentation/healthkit)
- [Google Fit](https://developers.google.com/fit)
