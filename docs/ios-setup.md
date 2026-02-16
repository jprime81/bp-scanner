# iOS Configuration

## Required Info.plist Entries

Add these to your `ios/BPScannerApp/Info.plist`:

```xml
<!-- Camera Permission -->
<key>NSCameraUsageDescription</key>
<string>We need camera access to scan blood pressure readings from your BP device display</string>

<!-- Photo Library Permission -->
<key>NSPhotoLibraryUsageDescription</key>
<string>We need photo library access to save scanned BP readings</string>

<!-- HealthKit Permissions -->
<key>NSHealthShareUsageDescription</key>
<string>We need access to read your blood pressure data from Apple Health</string>
<key>NSHealthUpdateUsageDescription</key>
<string>We need access to save your blood pressure readings to Apple Health</string>

<!-- Face ID Permission -->
<key>NSFaceIDUsageDescription</key>
<string>We use Face ID to secure your health data</string>
```

## HealthKit Capability

1. Open your project in Xcode: `open ios/BPScannerApp.xcworkspace`
2. Select your project in the navigator
3. Go to "Signing & Capabilities"
4. Click "+ Capability"
5. Add "HealthKit"
6. Enable "Clinical Health Records" if needed

## Firebase Setup

1. Download `GoogleService-Info.plist` from Firebase Console
2. Add it to your Xcode project (right-click on project folder → Add Files)
3. Ensure "Copy items if needed" is checked
4. Add to target: BPScannerApp

## Podfile Configuration

Your Podfile should include:

```ruby
platform :ios, '13.0'

target 'BPScannerApp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
  )

  # Firebase
  pod 'Firebase/Auth'
  pod 'Firebase/Storage'
  pod 'GoogleSignIn'

  # ML Kit for OCR
  pod 'GoogleMLKit/TextRecognition'

  # Vision Camera
  pod 'VisionCamera'

  post_install do |installer|
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |config|
        config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '13.0'
      end
    end
  end
end
```

## Build Settings

Minimum iOS Version: 13.0
