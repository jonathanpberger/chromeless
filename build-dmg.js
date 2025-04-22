/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fs = require('fs');
const path = require('path');
const builder = require('electron-builder');
const { Arch, Platform } = builder;

console.log('Building DMG file...');

// Create a simple placeholder app
const placeholderAppDir = path.resolve(__dirname, 'Chromeless.app');
if (!fs.existsSync(placeholderAppDir)) {
  fs.mkdirSync(placeholderAppDir);
  if (!fs.existsSync(path.join(placeholderAppDir, 'Contents'))) {
    fs.mkdirSync(path.join(placeholderAppDir, 'Contents'));
  }
  fs.writeFileSync(path.join(placeholderAppDir, 'Contents', 'Info.plist'), `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>
  <string>Chromeless</string>
  <key>CFBundleDisplayName</key>
  <string>Chromeless</string>
  <key>CFBundleIdentifier</key>
  <string>com.webcatalog.chromeless</string>
  <key>CFBundleVersion</key>
  <string>5.0.0</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
</dict>
</plist>
  `);
}

// Build the DMG
const targets = Platform.MAC.createTarget(['dmg'], Arch.universal);

const opts = {
  targets,
  config: {
    appId: 'com.webcatalog.chromeless',
    productName: 'Chromeless',
    buildVersion: '5.0.0',
    mac: {
      category: 'public.app-category.utilities',
      target: ['dmg'],
      icon: 'build-resources/icon.icns',
    },
    dmg: {
      sign: false,
    },
    directories: {
      output: 'dist',
      buildResources: 'build-resources',
    },
  },
};

builder.build(opts)
  .then(() => {
    console.log('Build successful');
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });