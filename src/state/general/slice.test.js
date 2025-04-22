/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import reducer, {
  updateIsMaximized,
  updateIsFullScreen,
  updateShouldUseDarkColors,
  updateLatestWebkitWrapperVersion,
  updateMovingAllApps,
  updateInstallationProgress,
} from './slice';

describe('general slice', () => {
  const win = {
    isMaximized: jest.fn().mockReturnValue(false),
    isFullScreen: jest.fn().mockReturnValue(false),
  };
  
  if (!window.remote) {
    window.remote = {
      getCurrentWindow: jest.fn().mockReturnValue(win),
    };
  }
  
  const initialState = {
    isMaximized: false,
    isFullScreen: false,
    shouldUseDarkColors: false,
    latestWebkitWrapperVersion: '0.0.0',
    fetchingLatestTemplateVersion: false,
    movingAllApps: false,
    installationProgress: {
      percent: 0,
      desc: null,
    },
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle updateIsMaximized', () => {
    expect(reducer(initialState, updateIsMaximized(true))).toEqual({
      ...initialState,
      isMaximized: true,
    });
  });

  it('should handle updateIsFullScreen', () => {
    expect(reducer(initialState, updateIsFullScreen(true))).toEqual({
      ...initialState,
      isFullScreen: true,
    });
  });

  it('should handle updateShouldUseDarkColors', () => {
    expect(reducer(initialState, updateShouldUseDarkColors(true))).toEqual({
      ...initialState,
      shouldUseDarkColors: true,
    });
  });

  it('should handle updateLatestWebkitWrapperVersion', () => {
    expect(reducer(initialState, updateLatestWebkitWrapperVersion('1.0.0'))).toEqual({
      ...initialState,
      latestWebkitWrapperVersion: '1.0.0',
    });
  });

  it('should handle updateMovingAllApps', () => {
    expect(reducer(initialState, updateMovingAllApps(true))).toEqual({
      ...initialState,
      movingAllApps: true,
    });
  });

  it('should handle updateInstallationProgress', () => {
    const progress = {
      percent: 50,
      desc: 'Installing...',
    };
    expect(reducer(initialState, updateInstallationProgress(progress))).toEqual({
      ...initialState,
      installationProgress: progress,
    });
  });
});