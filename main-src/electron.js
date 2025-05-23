/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
require('source-map-support').install();
const path = require('path');
const {
  app,
  ipcMain,
  nativeTheme,
  protocol,
} = require('electron');
const fs = require('fs');
const electronRemote = require('@electron/remote/main');

electronRemote.initialize();

const settings = require('electron-settings');

settings.configure({
  fileName: 'Settings', // backward compatible with electron-settings@3
});

const { autoUpdater } = require('electron-updater');

const {
  getPreference,
  getPreferences,
} = require('./libs/preferences');

const { createMenu } = require('./libs/menu');
const sendToAllWindows = require('./libs/send-to-all-windows');
const loadListeners = require('./libs/listeners').load;
const loadInvokers = require('./libs/invokers').load;

const mainWindow = require('./libs/windows/main');

require('./libs/updater');

// Handle creating/removing shortcuts on Windows when installing/uninstalling
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Ensure single instance of the app
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  // make sure "Settings" file exists
  // if not, ignore this chunk of code
  // as using electron-settings before app.on('ready') and "Settings" is created
  // would return error
  // https://github.com/nathanbuchar/electron-settings/issues/111
  if (fs.existsSync(settings.file())) {
    const useHardwareAcceleration = getPreference('useHardwareAcceleration');
    if (!useHardwareAcceleration) {
      app.disableHardwareAcceleration();
    }
  }

  loadListeners();
  loadInvokers();

  app.whenReady().then(() => {
    // https://github.com/electron/electron/issues/23757
    protocol.registerFileProtocol('file', (request, callback) => {
      const pathname = decodeURI(request.url.replace('file:///', ''));
      callback(pathname);
    });

    global.defaultIcon = path.join(
      app.getAppPath(),
      'default-app-icons',
      'default-icon.png',
    ).replace('app.asar', 'app.asar.unpacked');

    const {
      allowPrerelease,
      themeSource,
    } = getPreferences();

    // Set theme (light, dark, or system)
    nativeTheme.themeSource = themeSource;

    mainWindow.createAsync()
      .then(() => {
        // trigger whenFullyReady
        ipcMain.emit('truly-ready');

        const win = mainWindow.get();
        win.on('focus', () => {
          win.webContents.send('log-focus');
        });
      });

    createMenu();

    nativeTheme.addListener('updated', () => {
      sendToAllWindows('native-theme-updated');
    });

    autoUpdater.allowPrerelease = allowPrerelease;

    // Open the window if it isn't already open when the app is activated
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on('activate', () => {
      if (mainWindow.get() === null) {
        mainWindow.createAsync();
      } else {
        mainWindow.show();
      }
    });
  });

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('second-instance', () => {
    const win = mainWindow.get();
    if (win != null) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // In this file you can include the rest of your app-specific main process code
}