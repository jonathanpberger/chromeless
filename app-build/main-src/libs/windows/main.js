/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  BrowserWindow,
  Menu,
  Tray,
  app,
  ipcMain,
  nativeImage,
} = require('electron');
const path = require('path');
const windowStateKeeper = require('electron-window-state');
const { menubar } = require('menubar');
const contextMenu = require('electron-context-menu');
const electronRemote = require('@electron/remote/main');

const sendToAllWindows = require('../send-to-all-windows');
const { getPreference } = require('../preferences');
const { REACT_PATH } = require('../constants/paths');

const formatBytes = require('../format-bytes');

let win;
let mb = {};
let attachToMenubar = false;

const get = () => {
  if (attachToMenubar) return mb.window;
  return win;
};

const createAsync = () => new Promise((resolve) => {
  attachToMenubar = getPreference('attachToMenubar');

  if (attachToMenubar) {
    const menubarWindowState = windowStateKeeper({
      file: 'window-state-menubar.json',
      defaultWidth: 600,
      defaultHeight: 500,
    });

    // setImage after Tray instance is created to avoid
    // "Segmentation fault (core dumped)" bug on Linux
    // https://github.com/electron/electron/issues/22137#issuecomment-586105622
    // https://github.com/atomery/translatium/issues/164
    const tray = new Tray(nativeImage.createEmpty());
    const iconFileName = 'menubarTemplate.png';
    let iconPath;
    if (process.env.NODE_ENV === 'production') {
      iconPath = path.resolve(__dirname, 'images', iconFileName);
    } else {
      iconPath = path.resolve(__dirname, '..', '..', 'images', iconFileName);
    }
    tray.setImage(iconPath);

    mb = menubar({
      index: REACT_PATH,
      tray,
      preloadWindow: true,
      tooltip: 'Chromeless',
      browserWindow: {
        alwaysOnTop: getPreference('alwaysOnTop'),
        x: menubarWindowState.x,
        y: menubarWindowState.y,
        width: menubarWindowState.width,
        height: menubarWindowState.height,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
          // Modern Electron security model
          contextIsolation: true,
          nodeIntegration: false,
          webSecurity: true,
          preload: path.join(__dirname, 'preload-menubar.js'),
        },
      },
    });

    mb.on('after-create-window', () => {
      menubarWindowState.manage(mb.window);

      contextMenu({
        window: mb.window,
      });

      mb.window.on('focus', () => {
        const view = mb.window.getBrowserView();
        if (view && view.webContents) {
          view.webContents.focus();
        }
      });
    });

    mb.on('ready', () => {
      mb.tray.on('right-click', () => {
        const updaterEnabled = process.env.SNAP == null
          && !process.mas && !process.windowsStore;
        const updaterMenuItem = {
          label: 'Check for Updates...',
          click: () => ipcMain.emit('request-check-for-updates'),
          visible: updaterEnabled,
        };
        if (global.updaterObj && global.updaterObj.status === 'update-downloaded') {
          updaterMenuItem.label = 'Restart to Apply Updates...';
        } else if (global.updaterObj && global.updaterObj.status === 'update-available') {
          updaterMenuItem.label = 'Downloading Updates...';
          updaterMenuItem.enabled = false;
        } else if (global.updaterObj && global.updaterObj.status === 'download-progress') {
          const { transferred, total, bytesPerSecond } = global.updaterObj.info;
          updaterMenuItem.label = `Downloading Updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
          updaterMenuItem.enabled = false;
        } else if (global.updaterObj && global.updaterObj.status === 'checking-for-update') {
          updaterMenuItem.label = 'Checking for Updates...';
          updaterMenuItem.enabled = false;
        }

        const trayContextMenu = Menu.buildFromTemplate([
          {
            label: 'Open Chromeless',
            click: () => mb.showWindow(),
          },
          {
            type: 'separator',
          },
          {
            label: 'About Chromeless',
            click: () => {
              sendToAllWindows('open-dialog-about');
              mb.showWindow();
            },
          },
          {
            type: 'separator',
            visible: updaterEnabled,
          },
          updaterMenuItem,
          { type: 'separator' },
          {
            label: 'Preferences...',
            click: () => {
              sendToAllWindows('go-to-preferences');
              mb.showWindow();
            },
          },
          { type: 'separator' },
          {
            label: 'Quit',
            click: () => {
              mb.app.quit();
            },
          },
        ]);
        mb.tray.popUpContextMenu(trayContextMenu);
      });

      resolve();
    });
    return;
  }

  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 768,
  });

  const winOpts = {
    backgroundColor: '#FFF',
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    minWidth: 600,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    show: false,
    frame: true,
    alwaysOnTop: getPreference('alwaysOnTop'),
    webPreferences: {
      // Modern Electron security model
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      preload: path.join(__dirname, 'preload-main.js'),
    },
  };
  win = new BrowserWindow(winOpts);
  electronRemote.enable(win.webContents);

  mainWindowState.manage(win);

  contextMenu({
    window: win,
  });

  // check system-preferences.js
  // wasOpenedAsHidden is only available on macOS
  const { wasOpenedAsHidden } = app.getLoginItemSettings();
  win.once('ready-to-show', () => {
    if (!wasOpenedAsHidden) {
      win.show();
    }
  });

  win.on('closed', () => {
    win = null;
  });

  win.on('enter-full-screen', () => {
    win.webContents.send('set-is-full-screen', true);
  });
  win.on('leave-full-screen', () => {
    win.webContents.send('set-is-full-screen', false);
  });

  win.on('maximize', () => {
    win.webContents.send('set-is-maximized', true);
  });
  win.on('unmaximize', () => {
    win.webContents.send('set-is-maximized', false);
  });

  // ensure redux is loaded first
  // if not, redux might not be able catch changes sent from ipcMain
  win.webContents.once('did-stop-loading', () => {
    resolve();
  });

  win.loadURL(REACT_PATH);
});

const show = () => {
  if (attachToMenubar) {
    if (mb == null) {
      createAsync();
    } else {
      mb.on('ready', () => {
        mb.showWindow();
      });
    }
  } else if (win == null) {
    createAsync();
  } else {
    win.show();
  }
};

const send = (...args) => {
  if (get() !== null) {
    get().webContents.send(...args);
  }
};

module.exports = {
  createAsync,
  get,
  send,
  show,
};
