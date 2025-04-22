/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import semver from 'semver';

import { getShouldUseDarkColors } from '../../senders';

const win = window.remote.getCurrentWindow();

export const fetchLatestTemplateVersionAsync = createAsyncThunk(
  'general/fetchLatestTemplateVersion',
  async (_, { getState, dispatch }) => {
    const { allowPrerelease } = getState().preferences;
    
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const promises = [];

    // check for latest WebKit Wrapper version
    if (window.process.platform === 'darwin') {
      const webkitPromise = async () => {
        if (allowPrerelease) {
          let stableVersion;
          let prereleaseVersion;
          
          const p = [
            window.fetch('https://webcatalog.io/chromeless/webkit-wrapper/releases/latest.json')
              .then((res) => res.json())
              .then((data) => { stableVersion = data.version; }),
            window.fetch('https://webcatalog.io/chromeless/webkit-wrapper/releases/prerelease.json')
              .then((res) => res.json())
              .then((data) => { prereleaseVersion = data.version; }),
          ];
          
          await Promise.all(p);
          
          return semver.gt(stableVersion, prereleaseVersion) 
            ? stableVersion 
            : prereleaseVersion;
        }

        const response = await window.fetch('https://webcatalog.io/chromeless/webkit-wrapper/releases/latest.json');
        const data = await response.json();
        return data.version;
      };

      promises.push(webkitPromise());
    }

    const results = await Promise.all(promises);
    
    return {
      latestWebkitWrapperVersion: results[0] || '0.0.0',
    };
  },
);

const generalSlice = createSlice({
  name: 'general',
  initialState: {
    isMaximized: win.isMaximized(),
    isFullScreen: win.isFullScreen(),
    shouldUseDarkColors: getShouldUseDarkColors(),
    latestWebkitWrapperVersion: '0.0.0',
    fetchingLatestTemplateVersion: false,
    movingAllApps: false,
    installationProgress: {
      percent: 0,
      desc: null,
    },
  },
  reducers: {
    updateIsMaximized: (state, action) => {
      state.isMaximized = action.payload;
    },
    updateIsFullScreen: (state, action) => {
      state.isFullScreen = action.payload;
    },
    updateShouldUseDarkColors: (state, action) => {
      state.shouldUseDarkColors = action.payload;
    },
    updateLatestWebkitWrapperVersion: (state, action) => {
      state.latestWebkitWrapperVersion = action.payload;
    },
    updateMovingAllApps: (state, action) => {
      state.movingAllApps = action.payload;
    },
    updateInstallationProgress: (state, action) => {
      state.installationProgress = {
        percent: action.payload.percent || 0,
        desc: action.payload.desc || null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestTemplateVersionAsync.pending, (state) => {
        state.fetchingLatestTemplateVersion = true;
      })
      .addCase(fetchLatestTemplateVersionAsync.fulfilled, (state, action) => {
        state.fetchingLatestTemplateVersion = false;
        if (action.payload.latestWebkitWrapperVersion) {
          state.latestWebkitWrapperVersion = action.payload.latestWebkitWrapperVersion;
        }
      })
      .addCase(fetchLatestTemplateVersionAsync.rejected, (state) => {
        state.fetchingLatestTemplateVersion = false;
        // Error handling could be added here
      });
  },
});

export const {
  updateIsMaximized,
  updateIsFullScreen,
  updateShouldUseDarkColors,
  updateLatestWebkitWrapperVersion,
  updateMovingAllApps,
  updateInstallationProgress,
} = generalSlice.actions;

export default generalSlice.reducer;