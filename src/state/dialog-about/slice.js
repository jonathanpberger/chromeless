/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { createSlice } from '@reduxjs/toolkit';

const dialogAboutSlice = createSlice({
  name: 'dialogAbout',
  initialState: {
    open: false,
  },
  reducers: {
    open: (state) => {
      state.open = true;
    },
    close: (state) => {
      state.open = false;
    },
  },
});

export const { open, close } = dialogAboutSlice.actions;

export default dialogAboutSlice.reducer;