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
          // Add other allowed channels here
        ];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, ...args);
        }
      },
      on: (channel, listener) => {
        const validChannels = [
          'set-is-full-screen',
          'set-is-maximized',
          // Add other allowed channels here
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
