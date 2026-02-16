# Optional Dependencies - Install When Implementing Features

This file lists packages that should be installed when implementing specific features.
These are omitted from the initial package.json to avoid version conflicts during setup.

## Camera & OCR Features

When implementing camera scanning:

```bash
# Vision Camera (core camera functionality)
npm install react-native-vision-camera

# For OCR text recognition, choose ONE of these:

# Option 1: Vision Camera OCR plugin (Recommended)
npm install vision-camera-ocr
npm install react-native-vision-camera react-native-worklets-core

# Option 2: React Native ML Kit
npm install @react-native-ml-kit/text-recognition
# Note: Verify latest version on npm

# Option 3: Tesseract OCR (fully offline)
npm install react-native-tesseract-ocr

# Image processing helper
npm install react-native-image-manipulator
```

**iOS Setup:**
```bash
cd ios && pod install && cd ..
```

Add to Info.plist:
```xml
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan blood pressure readings</string>
```

**Android Setup:**

Add to AndroidManifest.xml:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-feature android:name="android.hardware.camera" />
```

## Health Platform Integration

When implementing HealthKit (iOS) and Google Fit (Android):

```bash
# iOS HealthKit
npm install react-native-health
cd ios && pod install && cd ..

# Android Google Fit
npm install react-native-google-fit

# Alternative: Universal health package
npm install react-native-health-connect
```

**iOS Setup:**
- Enable HealthKit capability in Xcode
- Add NSHealthShareUsageDescription and NSHealthUpdateUsageDescription to Info.plist

**Android Setup:**
- Enable Fitness API in Google Cloud Console
- Add Google Fit permissions to AndroidManifest.xml
- Configure OAuth credentials

## Charts & Visualization

Already included in package.json:
- ✅ react-native-chart-kit
- ✅ react-native-svg

For more advanced charts:

```bash
# Alternative charting libraries
npm install react-native-chart-kit react-native-svg

# Or for more features
npm install react-native-svg-charts
npm install victory-native

# For Syncfusion charts (requires license)
npm install @syncfusion/ej2-react-charts
```

## Notifications & Reminders

```bash
# Push notifications (for reminders)
npm install @react-native-community/push-notification-ios
npm install react-native-push-notification

# Or use newer package
npm install @notifee/react-native
```

## PDF Export

```bash
# PDF generation
npm install react-native-html-to-pdf
npm install react-native-pdf

# Alternative
npm install @react-pdf/renderer
```

## Biometric Authentication

Already included:
- ✅ react-native-biometrics

No additional installation needed.

## Additional Image Processing

```bash
# If needed for OCR preprocessing
npm install react-native-image-filter-kit
npm install react-native-fast-image
```

## Development Tools

```bash
# Useful dev dependencies
npm install --save-dev reactotron-react-native
npm install --save-dev @welldone-software/why-did-you-render
```

## Installation Priority

### Phase 1 (Core - Already Installed)
- ✅ React Navigation
- ✅ SQLite Storage
- ✅ Firebase (Auth, Storage)
- ✅ Share
- ✅ Date Picker
- ✅ Chart Kit
- ✅ Biometrics

### Phase 2 (OCR Implementation)
- Vision Camera
- OCR package (choose one from options above)
- Image Manipulator

### Phase 3 (Health Integration)
- React Native Health (iOS)
- React Native Google Fit (Android)

### Phase 4 (Enhanced Features)
- Push Notifications
- PDF generation
- Advanced charting (if needed)

## Version Notes

Always check npm for the latest stable versions before installing:

```bash
npm view <package-name> versions
npm view <package-name> version  # latest version
```

## Troubleshooting

If you encounter peer dependency conflicts:

```bash
npm install --legacy-peer-deps
```

Or use:

```bash
npm install --force
```

For native module setup:

**iOS:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

**Android:**
```bash
cd android
./gradlew clean
cd ..
```

## Package Alternatives

If a package doesn't work or is outdated, here are alternatives:

| Feature | Primary | Alternative |
|---------|---------|-------------|
| Camera | react-native-vision-camera | react-native-camera |
| OCR | vision-camera-ocr | react-native-mlkit |
| Health (iOS) | react-native-health | - |
| Health (Android) | react-native-google-fit | react-native-health-connect |
| Charts | react-native-chart-kit | victory-native |
| PDF | react-native-html-to-pdf | @react-pdf/renderer |
| Biometrics | react-native-biometrics | react-native-touch-id |

## Notes

- Camera and OCR packages are intentionally excluded from initial package.json
- They require significant native setup and can cause build issues if not configured properly
- Install them only when you're ready to implement the camera feature
- Health packages are platform-specific and optional for core functionality
- The app works fully without these packages for manual entry and reporting features
