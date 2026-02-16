#!/bin/bash

# BP Scanner App Setup Script

echo "🩺 Setting up BP Scanner App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Check for iOS setup
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS - setting up iOS dependencies..."
    
    if ! command -v pod &> /dev/null; then
        echo "⚠️  CocoaPods not found. Installing..."
        sudo gem install cocoapods
    fi
    
    echo "📦 Installing iOS pods..."
    cd ios && pod install && cd ..
    
    if [ $? -eq 0 ]; then
        echo "✅ iOS pods installed successfully"
    else
        echo "⚠️  iOS pod installation failed. You may need to run 'cd ios && pod install' manually"
    fi
else
    echo "⚠️  Not on macOS - skipping iOS setup"
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Firebase Configuration (add your values here)
# FIREBASE_API_KEY=
# FIREBASE_AUTH_DOMAIN=
# FIREBASE_PROJECT_ID=
# FIREBASE_STORAGE_BUCKET=

# App Configuration
APP_VERSION=1.0.0
EOF
    echo "✅ .env file created"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure Firebase (see README.md)"
echo "2. Add google-services.json (Android) and GoogleService-Info.plist (iOS)"
echo "3. Run the app:"
echo "   - iOS: npm run ios"
echo "   - Android: npm run android"
echo ""
