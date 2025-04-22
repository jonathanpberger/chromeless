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
</dict>
</plist>
EOF

# Copy icon
cp "./build-resources/icon.icns" "${TEMP_DIR}/${APP_NAME}.app/Contents/Resources/"

# Create a simple executable
cat > "${TEMP_DIR}/${APP_NAME}.app/Contents/MacOS/app" << EOF
#!/bin/bash
osascript -e 'tell app "System Events" to display dialog "This is a placeholder app for ${APP_NAME} ${VERSION}.\n\nThank you for installing with Homebrew!" buttons {"OK"} default button 1 with title "${APP_NAME} ${VERSION}"'
EOF

# Make it executable
chmod +x "${TEMP_DIR}/${APP_NAME}.app/Contents/MacOS/app"

# Create DMG
echo "Creating DMG file..."
hdiutil create -volname "${VOLUME_NAME}" -srcfolder "${TEMP_DIR}" -ov -format UDZO "${DEST_DIR}/${DMG_NAME}"

# Show hash
echo "DMG created: ${DEST_DIR}/${DMG_NAME}"
shasum -a 256 "${DEST_DIR}/${DMG_NAME}"

# Cleanup
rm -rf "${TEMP_DIR}"

echo "Done!"