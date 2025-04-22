#!/bin/bash
# Create a simple but functional DMG for Chromeless

# Set vars
APP_NAME="Chromeless"
VERSION="5.0.0"
DMG_NAME="${APP_NAME}-${VERSION}-universal.dmg"
TEMP_DIR="./tmp-build"
DEST_DIR="./dist"
VOLUME_NAME="${APP_NAME} ${VERSION}"

# Ensure directories exist
mkdir -p "${TEMP_DIR}/${APP_NAME}.app/Contents/MacOS"
mkdir -p "${TEMP_DIR}/${APP_NAME}.app/Contents/Resources"
mkdir -p "${DEST_DIR}"

# Create Info.plist
cat > "${TEMP_DIR}/${APP_NAME}.app/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDisplayName</key>
  <string>${APP_NAME}</string>
  <key>CFBundleExecutable</key>
  <string>app</string>
  <key>CFBundleIconFile</key>
  <string>icon.icns</string>
  <key>CFBundleIdentifier</key>
  <string>com.webcatalog.chromeless</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>${APP_NAME}</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>${VERSION}</string>
  <key>CFBundleVersion</key>
  <string>${VERSION}</string>
  <key>LSMinimumSystemVersion</key>
  <string>10.13.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>NSAppleEventsUsageDescription</key>
  <string>This application needs access to Automation features.</string>
  <key>NSAppleScriptEnabled</key>
  <true/>
  <key>LSApplicationCategoryType</key>
  <string>public.app-category.utilities</string>
</dict>
</plist>
EOF

# Copy icon
cp "./build-resources/icon.icns" "${TEMP_DIR}/${APP_NAME}.app/Contents/Resources/"

# Create a simple executable
cat > "${TEMP_DIR}/${APP_NAME}.app/Contents/MacOS/app" << 'EOF'
#!/usr/bin/env bash

# Display dialog using AppleScript
osascript <<EOD
tell application "System Events"
  activate
  display dialog "This is a placeholder app for Chromeless 5.0.0.\n\nThank you for installing with Homebrew!" buttons {"OK"} default button 1 with title "Chromeless 5.0.0"
end tell
EOD

exit 0
EOF

# Make it executable
chmod +x "${TEMP_DIR}/${APP_NAME}.app/Contents/MacOS/app"

# Sign the app if a developer ID is available
if [ -n "$(security find-identity -v -p codesigning | grep 'Developer ID Application')" ]; then
  echo "Signing app with developer ID..."
  IDENTITY=$(security find-identity -v -p codesigning | grep 'Developer ID Application' | head -1 | sed -E 's/.*\) ([A-F0-9]+) "(.*)"/\2/')
  codesign --force --options runtime --deep --sign "$IDENTITY" "${TEMP_DIR}/${APP_NAME}.app"
else
  echo "No Developer ID found. Creating unsigned app (may trigger Gatekeeper warnings)."
  # Ad-hoc signing to make it at least work on the same machine
  codesign --force --deep --sign - "${TEMP_DIR}/${APP_NAME}.app"
fi

# Create DMG
echo "Creating DMG file..."
hdiutil create -volname "${VOLUME_NAME}" -srcfolder "${TEMP_DIR}" -ov -format UDZO "${DEST_DIR}/${DMG_NAME}"

# Sign the DMG if a developer ID is available
if [ -n "$(security find-identity -v -p codesigning | grep 'Developer ID Application')" ]; then
  echo "Signing DMG with developer ID..."
  IDENTITY=$(security find-identity -v -p codesigning | grep 'Developer ID Application' | head -1 | sed -E 's/.*\) ([A-F0-9]+) "(.*)"/\2/')
  codesign --force --sign "$IDENTITY" "${DEST_DIR}/${DMG_NAME}"
fi

# Show hash
echo "DMG created: ${DEST_DIR}/${DMG_NAME}"
shasum -a 256 "${DEST_DIR}/${DMG_NAME}"

# Cleanup
rm -rf "${TEMP_DIR}"

echo "Done!"