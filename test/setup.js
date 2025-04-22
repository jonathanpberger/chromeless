/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// Mock the Electron remote object
window.remote = {
  getCurrentWindow: jest.fn().mockReturnValue({
    isMaximized: jest.fn().mockReturnValue(false),
    isFullScreen: jest.fn().mockReturnValue(false),
  }),
  shell: {
    showItemInFolder: jest.fn(),
  },
  Menu: {
    buildFromTemplate: jest.fn().mockReturnValue({
      popup: jest.fn(),
    }),
  },
  dialog: {
    showOpenDialog: jest.fn(),
  },
};

// Add missing process object for tests
window.process = {
  platform: 'darwin',
};

// Mock getShouldUseDarkColors
jest.mock('../src/senders', () => ({
  getShouldUseDarkColors: jest.fn().mockReturnValue(false),
  requestOpenApp: jest.fn(),
  requestOpenInBrowser: jest.fn(),
  requestUninstallApp: jest.fn(),
  requestCancelInstallApp: jest.fn(),
  requestCancelUpdateApp: jest.fn(),
}));