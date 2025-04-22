/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fs = require('fs-extra');
const path = require('path');
const builder = require('electron-builder');
const { Arch, Platform } = builder;
const { exec } = require('child_process');

const packageJson = require('./package.json');

console.log('Building a more complete DMG file...');

// Prepare app directory
const buildDir = path.resolve(__dirname, 'app-build');
fs.removeSync(buildDir);
fs.ensureDirSync(buildDir);

// Copy public assets
fs.copySync(
  path.join(__dirname, 'public'),
  path.join(buildDir, 'public')
);

// Copy build-resources 
fs.copySync(
  path.join(__dirname, 'build-resources'),
  path.join(buildDir, 'build-resources')
);

// Copy main-src (Electron main process code)
fs.copySync(
  path.join(__dirname, 'main-src'),
  path.join(buildDir, 'main-src')
);

// Create a minimal package.json for the app
const appPackageJson = {
  name: packageJson.name,
  productName: packageJson.productName,
  description: packageJson.description,
  version: packageJson.version,
  main: "electron.js", // Use our simplified electron.js as the entry point
  author: packageJson.author,
  license: "MPL-2.0",
  dependencies: {},
};

fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify(appPackageJson, null, 2)
);

// Create an index.html file with a message
fs.writeFileSync(
  path.join(buildDir, 'index.html'),
  `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Chromeless</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
      background: #f5f5f5;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    h1 {
      color: #2196F3;
      font-size: 28px;
      margin-bottom: 10px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      max-width: 600px;
    }
    img {
      width: 128px;
      height: 128px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <img src="build-resources/icon.png" alt="Chromeless Logo">
  <h1>Chromeless v${packageJson.version}</h1>
  <p>
    This is a demo version of Chromeless for Homebrew installation testing.
    Turn any website into a site-specific browser.
  </p>
  <p>
    <strong>Note:</strong> This is a placeholder app for testing purposes.
  </p>
</body>
</html>`
);

// Create basic electron.js files
fs.ensureDirSync(path.join(buildDir, 'build'));

// Create a simplified electron.js in the main directory
fs.writeFileSync(
  path.join(buildDir, 'electron.js'),
  `const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Chromeless',
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});`);

// Create the same file in the build directory (for electron-builder compatibility)
fs.writeFileSync(
  path.join(buildDir, 'build', 'electron.js'),
  `const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'Chromeless',
  });

  mainWindow.loadFile(path.join(__dirname, '../index.html'));
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});`
);

// Build the DMG
const targets = Platform.MAC.createTarget(['dmg'], Arch.universal);

const opts = {
  targets,
  config: {
    appId: 'com.webcatalog.chromeless',
    productName: 'Chromeless',
    buildVersion: packageJson.version,
    files: [
      "**/*",
      "!node_modules${/*}",
      "!src${/*}"
    ],
    mac: {
      category: 'public.app-category.utilities',
      target: ['dmg'],
      icon: 'build-resources/icon.icns',
      darkModeSupport: true,
    },
    dmg: {
      sign: false,
    },
    directories: {
      output: 'dist',
      app: buildDir,
      buildResources: 'build-resources',
    },
    extraMetadata: {
      main: "build/electron.js" // Tell electron-builder to use this as the main entry point
    }
  },
};

builder.build(opts)
  .then(() => {
    console.log('Build successful');
    // Now we need to calculate the SHA256 hash
    exec(`shasum -a 256 dist/Chromeless-${packageJson.version}-universal.dmg`, (error, stdout) => {
      if (error) {
        console.error(`Error calculating SHA256: ${error}`);
        return;
      }
      console.log(`\nSHA256 hash for Homebrew formula:`);
      console.log(stdout);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });