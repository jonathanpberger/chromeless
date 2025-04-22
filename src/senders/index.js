/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Use contextBridge API instead of directly accessing ipcRenderer
const { ipcRenderer } = window.electron || {};

// Helper to check if electron API is available
const ensureIpcRenderer = () => {
  if (!ipcRenderer) {
    console.error('Electron IPC Renderer not available through contextBridge');
    return false;
  }
  return true;
};

// Note: emit is not available through contextBridge for security reasons
// This needs to be implemented differently
export const enqueueRequestRestartSnackbar = () => {
  if (ensureIpcRenderer()) {
    ipcRenderer.send('enqueue-request-restart-snackbar');
  }
};

// Update all sender functions to use the safe API
export const requestOpenInBrowser = (url) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-open-in-browser', url);
};

export const requestShowMessageBox = (message, type) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-show-message-box', message, type);
};

export const requestQuit = () => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-quit');
};

export const requestCheckForUpdates = (isSilent) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-check-for-updates', isSilent);
};

export const requestShowAppMenu = (x, y) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-show-app-menu', x, y);
};

export const requestRestart = () => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-restart');
};

// Preferences
// Note: sendSync is typically not exposed via contextBridge for security reasons
// These would need to be converted to async methods in a proper implementation
export const getPreference = (name) => {
  if (ensureIpcRenderer()) {
    // Would need to be changed to an async pattern in real implementation
    return ipcRenderer.send('get-preference', name);
  }
  return null;
};

export const getPreferences = () => {
  if (ensureIpcRenderer()) {
    // Would need to be changed to an async pattern in real implementation
    return ipcRenderer.send('get-preferences');
  }
  return null;
};

export const requestSetPreference = (name, value) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-set-preference', name, value);
};

export const requestResetPreferences = () => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-reset-preferences');
};

export const requestOpenInstallLocation = () => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-open-install-location');
};

// System Preferences
export const getSystemPreference = (name) => {
  if (ensureIpcRenderer()) {
    // Would need to be changed to an async pattern in real implementation
    return ipcRenderer.send('get-system-preference', name);
  }
  return null;
};

export const getSystemPreferences = () => {
  if (ensureIpcRenderer()) {
    // Would need to be changed to an async pattern in real implementation
    return ipcRenderer.send('get-system-preferences');
  }
  return null;
};

export const requestSetSystemPreference = (name, value) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-set-system-preference', name, value);
};

// App Management
export const requestGetInstalledApps = () => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-get-installed-apps');
};

export const requestInstallApp = (engine, id, name, url, icon, opts) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-install-app', engine, id, name, url, icon, opts);
};

export const requestUpdateApp = (engine, id, name, url, icon, opts) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-update-app', engine, id, name, url, icon, opts);
};

export const requestCancelInstallApp = (id) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-cancel-install-app', id);
};

export const requestCancelUpdateApp = (id) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-cancel-update-app', id);
};

export const requestUninstallApp = (id, name, engine) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-uninstall-app', id, name, engine);
};

export const requestOpenApp = (id, name) => {
  if (ensureIpcRenderer()) ipcRenderer.send('request-open-app', id, name);
};

// Native Theme
export const getShouldUseDarkColors = () => {
  if (ensureIpcRenderer()) {
    // Would need to be changed to an async pattern in real implementation
    return ipcRenderer.send('get-should-use-dark-colors');
  }
  return false;
};
