/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// cached global values to improve performance
// most of global values are static, unchanged
// so we don't need to keep getting update from remote
// https://github.com/electron/electron/issues/1258
const cached = {};

// Note: With contextBridge, we need to add any globals we need to access
// to the electron.remote API exposed in preload-shared.js
const getStaticGlobal = (key) => {
  if (!cached[key]) {
    // Implementation may need to be updated based on which globals are needed
    // For now, accessing specific properties from electron.remote
    if (window.electron && window.electron.remote) {
      if (key === 'appVersion') {
        cached[key] = window.electron.remote.app.getVersion();
      } else if (key === 'appName') {
        cached[key] = window.electron.remote.app.getName();
      } else {
        console.warn(`getStaticGlobal: Unable to access global '${key}' via contextBridge`);
        cached[key] = null;
      }
    } else {
      console.warn('getStaticGlobal: electron.remote not available');
      cached[key] = null;
    }
  }

  return cached[key];
};

export default getStaticGlobal;
