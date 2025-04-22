/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import reducer, { open, close } from './slice';

describe('dialog-about slice', () => {
  const initialState = {
    open: false,
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle open action', () => {
    const previousState = initialState;
    expect(reducer(previousState, open())).toEqual({
      open: true,
    });
  });

  it('should handle close action', () => {
    const previousState = {
      open: true,
    };
    expect(reducer(previousState, close())).toEqual({
      open: false,
    });
  });
});