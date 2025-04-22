/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { contextBridge, ipcRenderer } = require('electron');
const remote = require('@electron/remote');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', {
    remote: {
      app: {
        getVersion: () => remote.app.getVersion(),
        getName: () => remote.app.getName(),
      },
      dialog: {
        showOpenDialog: (options) => remote.dialog.showOpenDialog(options),
        showMessageBox: (options) => remote.dialog.showMessageBox(options),
      },
      getCurrentWindow: () => remote.getCurrentWindow(),
      process: {
        platform: remote.process.platform,
        mas: remote.process.mas,
        windowsStore: remote.process.windowsStore,
      },
    },
    ipcRenderer: {
      send: (channel, ...args) => {
        // Whitelist channels that can be used
        const validChannels = [
          'request-check-for-updates',
          'open-dialog-about',
          'go-to-preferences',
          'request-open-in-browser',
          'request-show-message-box',
          'request-quit',
          'request-restart',
          'request-set-preference',
          'request-reset-preferences',
          'request-open-install-location',
          'request-set-system-preference',
          'request-get-installed-apps',
          'request-install-app',
          'request-update-app',
          'request-cancel-install-app',
          'request-cancel-update-app',
          'request-uninstall-app',
          'request-open-app',
          'enqueue-request-restart-snackbar',
          'request-show-app-menu',
        ];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, ...args);
        }
      },
      // Add support for invoking async handlers
      invoke: (channel, ...args) => {
        const validChannels = [
          'get-preference-async',
          'get-preferences-async',
          'get-system-preference-async',
          'get-system-preferences-async',
          'get-should-use-dark-colors-async',
        ];
        if (validChannels.includes(channel)) {
          return ipcRenderer.invoke(channel, ...args);
        }
        return Promise.reject(new Error(`Invalid channel: ${channel}`));
      },
      on: (channel, listener) => {
        const validChannels = [
          'set-is-full-screen',
          'set-is-maximized',
          'set-app',
          'remove-app',
          'enqueue-snackbar',
        ];
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender` 
          ipcRenderer.on(channel, (event, ...args) => listener(...args));
        }
      },
      removeListener: (channel, listener) => {
        ipcRenderer.removeListener(channel, listener);
      },
    },
  },
);
